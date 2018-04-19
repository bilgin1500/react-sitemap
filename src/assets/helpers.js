// Basic string-to-slug converter.
// Used in the ID generating process.
export const slugify = text =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

// A fake UID generator.
// Used in the DEFAULT_PROPS when no ID is set via component properties.
export const createUID = () =>
  Math.random()
    .toString(36)
    .substring(2) + new Date().getTime().toString(36);

// Takes two arguments:
// An object or array whose keys are to be modified and
// A function by which the keys of your object will be modified
// https://github.com/JonSchapiro/deep-map-keys
export const deepMapKeys = (obj, mod) => {
  const transform = (obj, mod) => {
    if (Array.isArray(obj)) {
      return obj.map(val => transform(val, mod));
    }
    if (obj != null && typeof obj === 'object') {
      return Object.keys(obj).reduce((accum, key) => {
        accum[mod(key)] = transform(obj[key], mod);
        return accum;
      }, {});
    }
    return obj;
  };

  return transform(obj, mod);
};

// Throttle function based on Ban Alman's jQuery library
// http://benalman.com/projects/jquery-throttle-debounce-plugin/
// https://www.npmjs.com/package/throttle-debounce
export const throttle = (delay, noTrailing, callback, debounceMode) => {
  let timeoutID;
  let lastExec = 0;

  if (typeof noTrailing !== 'boolean') {
    debounceMode = callback;
    callback = noTrailing;
    noTrailing = undefined;
  }

  function wrapper() {
    let self = this;
    let elapsed = Number(new Date()) - lastExec;
    let args = arguments;

    function exec() {
      lastExec = Number(new Date());
      callback.apply(self, args);
    }

    function clear() {
      timeoutID = undefined;
    }

    if (debounceMode && !timeoutID) exec();
    if (timeoutID) clearTimeout(timeoutID);
    if (debounceMode === undefined && elapsed > delay) {
      exec();
    } else if (noTrailing !== true) {
      timeoutID = setTimeout(
        debounceMode ? clear : exec,
        debounceMode === undefined ? delay - elapsed : delay
      );
    }
  }
  return wrapper;
};

/**
 * Promise based XHR Get wrapper
 * @param  {object} options:
 *         {string} url - The url to be fetched
 *         {string} responseType -The response type
 * @return {Promise} Resolve with response or
 *                   reject with error
 *                   ({type:1 server error, type 2: network error})
 */
export const request = options => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(Error({ type: 1 }));
      }
    };
    xhr.onerror = () => reject(Error({ type: 2 }));
    xhr.open('GET', options.url);
    if (options.responseType) xhr.responseType = options.responseType;
    xhr.send();
  });
};
