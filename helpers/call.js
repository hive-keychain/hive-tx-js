const config = require('../config')

/**
 * Make calls to hive node
 * @param {string}method - e.g. condenser_api.get_dynamic_global_properties
 * @param {Array}params - an array
 * @param {Number}timeout - optional - default 10 seconds
 * @param {string}overrideRpc - optional - override RPC from config
 */
const call = async (method, params = [], timeout = 10, overrideRpc = undefined) => {
    let resolved = false

  return new Promise((resolve, reject) => {
    try {
      fetch(overrideRpc ? overrideRpc : config.node, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: 1
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => {
        if (res && res.status === 200) {
          resolved = true
          resolve(res.json())
        }
      })

      setTimeout(() => {
        if (!resolved) {
          reject(new Error('Network timeout.'))
        }
      }, timeout * 1000)
    } catch(err){
      resolved = true;
      reject(err);
    }
  })
}

module.exports = call
