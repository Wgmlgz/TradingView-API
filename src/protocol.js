import  JSZip from 'jszip'

/**
 * @typedef {Object} TWPacket
 * @prop {string} [m] Packet type
 * @prop {[session: string, {}]} [p] Packet data
 */

const cleanerRgx = /~h~/g
const splitterRgx = /~m~[0-9]{1,}~m~/g

/**
 * Parse websocket packet
 * @function parseWSPacket
 * @param {string} str Websocket raw data
 * @returns {TWPacket[]} TradingView packets
 */
export function parseWSPacket(str) {
  str = str.data;
  return str.replace(cleanerRgx, '').split(splitterRgx)
    .map((p) => {
      if (!p) return false
      try {
        return JSON.parse(p)
      } catch (error) {
        console.warn('Cant parse', p)
        return false
      }
    })
    .filter((p) => p)
}

/**
 * Format websocket packet
 * @function formatWSPacket
 * @param {TWPacket} packet TradingView packet
 * @returns {string} Websocket raw data
 */
export function formatWSPacket(packet) {
  const msg = typeof packet === 'object'
    ? JSON.stringify(packet)
    : packet
  return `~m~${msg.length}~m~${msg}`
}

/**
 * Parse compressed data
 * @function parseCompressed
 * @param {string} data Compressed data
 * @returns {Promise<{}>} Parsed data
 */
export async function parseCompressed(data) {
  const zip = new JSZip()
  return JSON.parse(
    await (
      await zip.loadAsync(data, { base64: true })
    ).file('').async('text'),
  )
}
