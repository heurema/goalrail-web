/**
 * Proves the sponsorship addresses before they can ship.
 *
 * These addresses were transcribed from screenshots by hand. A single wrong
 * character sends a stranger's money somewhere nobody can retrieve it from, and
 * proofreading is not a control — so two independent checks run in CI instead.
 *
 * 1. Every address is validated against its own checksum. A one-character slip
 *    fails these with overwhelming probability. Solana is the exception and is
 *    reported as such: a Solana address is a bare public key with no checksum
 *    at all, so the only available check is that it decodes to the 32 bytes one
 *    must be.
 *
 * 2. Every QR code is generated exactly as the page generates it and then read
 *    back with jsQR — a decoder, written by other people, that shares no code
 *    with the encoder. If the two agree on the string, the code on the page
 *    carries the address printed beside it.
 *
 * Run with `npm run verify:wallets`.
 */

import {createHash} from 'node:crypto';
import {keccak_256} from '@noble/hashes/sha3.js';
import {encode} from 'uqr';
import jsQRModule from 'jsqr';
import {WALLETS} from '../src/content.ts';

const jsQR = jsQRModule.default ?? jsQRModule;

/** The options the page renders with. Kept identical on purpose. */
const QR_OPTIONS = {ecc: 'M', border: 4};

// --- checksums -------------------------------------------------------------

const BECH32_CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const BECH32_GENERATOR = [
  0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3,
];

function bech32Polymod(values) {
  let checksum = 1;
  for (const value of values) {
    const top = checksum >>> 25;
    checksum = ((checksum & 0x1ffffff) << 5) ^ value;
    for (let i = 0; i < 5; i += 1) {
      if ((top >> i) & 1) checksum ^= BECH32_GENERATOR[i];
    }
  }
  return checksum >>> 0;
}

function checkBech32(address) {
  if (address !== address.toLowerCase()) return 'mixed case';
  const separator = address.lastIndexOf('1');
  const prefix = address.slice(0, separator);
  const data = address.slice(separator + 1);
  const values = [];
  for (const character of data) {
    const index = BECH32_CHARSET.indexOf(character);
    if (index < 0) return `character ${character} is outside the charset`;
    values.push(index);
  }
  const expanded = [
    ...[...prefix].map((c) => c.charCodeAt(0) >> 5),
    0,
    ...[...prefix].map((c) => c.charCodeAt(0) & 31),
    ...values,
  ];
  const polymod = bech32Polymod(expanded);
  if (polymod === 1) return null;
  if (polymod === 0x2bc830a3) return null;
  return `checksum does not verify (${polymod.toString(16)})`;
}

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Decode(input) {
  let number = 0n;
  for (const character of input) {
    const index = BASE58.indexOf(character);
    if (index < 0) throw new Error(`character ${character} is not base58`);
    number = number * 58n + BigInt(index);
  }
  const digits = [];
  while (number > 0n) {
    digits.unshift(Number(number & 0xffn));
    number >>= 8n;
  }
  let leading = 0;
  while (leading < input.length && input[leading] === '1') leading += 1;
  return Uint8Array.from([...new Array(leading).fill(0), ...digits]);
}

function sha256(bytes) {
  return Uint8Array.from(createHash('sha256').update(bytes).digest());
}

function checkBase58Check(address, expectedPrefix) {
  const raw = base58Decode(address);
  if (raw.length !== 25) return `decodes to ${raw.length} bytes, expected 25`;
  if (raw[0] !== expectedPrefix) {
    return `version byte 0x${raw[0].toString(16)}, expected 0x${expectedPrefix.toString(16)}`;
  }
  const expected = sha256(sha256(raw.slice(0, 21))).slice(0, 4);
  const actual = raw.slice(21);
  const same = expected.every((byte, index) => byte === actual[index]);
  return same ? null : 'checksum does not verify';
}

function checkEip55(address) {
  const body = address.slice(2);
  if (!/^[0-9a-fA-F]{40}$/.test(body)) return 'not 40 hex characters';
  const digest = Buffer.from(
    keccak_256(new TextEncoder().encode(body.toLowerCase())),
  ).toString('hex');
  const expected = [...body.toLowerCase()]
    .map((character, index) =>
      parseInt(digest[index], 16) >= 8
        ? character.toUpperCase()
        : character.toLowerCase(),
    )
    .join('');
  if (expected === body) return null;
  return `capitalization does not match; the checksummed form is 0x${expected}`;
}

function checkEd25519PublicKey(address) {
  const raw = base58Decode(address);
  return raw.length === 32 ? null : `decodes to ${raw.length} bytes, expected 32`;
}

/** Which check an address earns, and how strong that check is. */
function checksumFor(address) {
  if (address.startsWith('bc1')) {
    return {name: 'bech32', run: () => checkBech32(address), strong: true};
  }
  if (address.startsWith('0x')) {
    return {name: 'EIP-55', run: () => checkEip55(address), strong: true};
  }
  if (address.startsWith('T')) {
    return {
      name: 'base58check',
      run: () => checkBase58Check(address, 0x41),
      strong: true,
    };
  }
  return {
    name: 'length only — this chain has no checksum',
    run: () => checkEd25519PublicKey(address),
    strong: false,
  };
}

// --- the QR round trip -----------------------------------------------------

/**
 * jsQR reads pixels, so the module matrix is expanded into an RGBA buffer.
 * Nothing is rasterized to a file: the matrix the page draws is the matrix that
 * gets decoded, which is the point of the check.
 */
function decodeQr(text) {
  const result = encode(text, QR_OPTIONS);
  const scale = 4;
  const width = result.size * scale;
  const pixels = new Uint8ClampedArray(width * width * 4);
  for (let y = 0; y < width; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const dark = result.data[Math.floor(y / scale)][Math.floor(x / scale)];
      const value = dark ? 0 : 255;
      const offset = (y * width + x) * 4;
      pixels[offset] = value;
      pixels[offset + 1] = value;
      pixels[offset + 2] = value;
      pixels[offset + 3] = 255;
    }
  }
  return jsQR(pixels, width, width)?.data ?? null;
}

// --- report ----------------------------------------------------------------

let failed = false;
let weak = 0;

if (WALLETS.length === 0) {
  console.log('No wallets are configured; nothing to verify.');
  process.exit(0);
}

for (const wallet of WALLETS) {
  const checksum = checksumFor(wallet.address);
  const checksumProblem = checksum.run();
  const decoded = decodeQr(wallet.address);

  const problems = [];
  if (checksumProblem) problems.push(`${checksum.name}: ${checksumProblem}`);
  if (decoded === null) problems.push('the QR code could not be decoded at all');
  else if (decoded !== wallet.address) {
    problems.push(`the QR code carries a different string: ${decoded}`);
  }

  if (problems.length > 0) {
    failed = true;
    console.error(`FAIL  ${wallet.network}`);
    for (const problem of problems) console.error(`      ${problem}`);
    continue;
  }

  if (!checksum.strong) weak += 1;
  console.log(
    `ok    ${wallet.network.padEnd(30)} ${checksum.name}, QR decodes to the same string`,
  );
}

if (weak > 0) {
  console.log(
    `\n${weak} address(es) carry no checksum of their own. Their only proof is` +
      ' the QR round trip and the length, so check those against the wallet by eye.',
  );
}

if (failed) {
  console.error('\nAt least one address did not verify. Nothing should ship.');
  process.exit(1);
}
