// Xuper para Nuvio oficial.
// Generado por build.py; no editar a mano.
// Requiere que Nuvio exponga TMDB_API_KEY y fetch en el runtime de plugins.
var __XUPER_MAGIS_KEY = "e7af1ed7de1ffddd7bd3fe37ebdffde9ef3fe1ae39edfeb8";

var CryptoJS = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  ;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory();
	}
}(this, function () {

	/*globals window, global, require*/

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {

	    var crypto;

	    // Native crypto from window (Browser)
	    if (typeof window !== 'undefined' && window.crypto) {
	        crypto = window.crypto;
	    }

	    // Native crypto in web worker (Browser)
	    if (typeof self !== 'undefined' && self.crypto) {
	        crypto = self.crypto;
	    }

	    // Native crypto from worker
	    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
	        crypto = globalThis.crypto;
	    }

	    // Native (experimental IE 11) crypto from window (Browser)
	    if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
	        crypto = window.msCrypto;
	    }

	    // Native crypto from global (NodeJS)
	    if (!crypto && typeof global !== 'undefined' && global.crypto) {
	        crypto = global.crypto;
	    }

	    // Native crypto import via require (NodeJS)
	    if (!crypto && typeof require === 'function') {
	        try {
	            crypto = require('crypto');
	        } catch (err) {}
	    }

	    /*
	     * Cryptographically secure pseudorandom number generator
	     *
	     * As Math.random() is cryptographically not safe to use
	     */
	    var cryptoSecureRandomInt = function () {
	        if (crypto) {
	            // Use getRandomValues method (Browser)
	            if (typeof crypto.getRandomValues === 'function') {
	                try {
	                    return crypto.getRandomValues(new Uint32Array(1))[0];
	                } catch (err) {}
	            }

	            // Use randomBytes method (NodeJS)
	            if (typeof crypto.randomBytes === 'function') {
	                try {
	                    return crypto.randomBytes(4).readInt32LE();
	                } catch (err) {}
	            }
	        }

	        throw new Error('Native crypto module could not be used to get secure random number.');
	    };

	    /*
	     * Local polyfill of Object.create

	     */
	    var create = Object.create || (function () {
	        function F() {}

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }());

	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {


	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var j = 0; j < thatSigBytes; j += 4) {
	                    thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            for (var i = 0; i < nBytes; i += 4) {
	                words.push(cryptoSecureRandomInt());
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            var processedWords;

	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	(function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var X32WordArray = C_lib.WordArray;

	    /**
	     * x64 namespace.
	     */
	    var C_x64 = C.x64 = {};

	    /**
	     * A 64-bit word.
	     */
	    var X64Word = C_x64.Word = Base.extend({
	        /**
	         * Initializes a newly created 64-bit word.
	         *
	         * @param {number} high The high 32 bits.
	         * @param {number} low The low 32 bits.
	         *
	         * @example
	         *
	         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
	         */
	        init: function (high, low) {
	            this.high = high;
	            this.low = low;
	        }

	        /**
	         * Bitwise NOTs this word.
	         *
	         * @return {X64Word} A new x64-Word object after negating.
	         *
	         * @example
	         *
	         *     var negated = x64Word.not();
	         */
	        // not: function () {
	            // var high = ~this.high;
	            // var low = ~this.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise ANDs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to AND with this word.
	         *
	         * @return {X64Word} A new x64-Word object after ANDing.
	         *
	         * @example
	         *
	         *     var anded = x64Word.and(anotherX64Word);
	         */
	        // and: function (word) {
	            // var high = this.high & word.high;
	            // var low = this.low & word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise ORs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to OR with this word.
	         *
	         * @return {X64Word} A new x64-Word object after ORing.
	         *
	         * @example
	         *
	         *     var ored = x64Word.or(anotherX64Word);
	         */
	        // or: function (word) {
	            // var high = this.high | word.high;
	            // var low = this.low | word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise XORs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to XOR with this word.
	         *
	         * @return {X64Word} A new x64-Word object after XORing.
	         *
	         * @example
	         *
	         *     var xored = x64Word.xor(anotherX64Word);
	         */
	        // xor: function (word) {
	            // var high = this.high ^ word.high;
	            // var low = this.low ^ word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Shifts this word n bits to the left.
	         *
	         * @param {number} n The number of bits to shift.
	         *
	         * @return {X64Word} A new x64-Word object after shifting.
	         *
	         * @example
	         *
	         *     var shifted = x64Word.shiftL(25);
	         */
	        // shiftL: function (n) {
	            // if (n < 32) {
	                // var high = (this.high << n) | (this.low >>> (32 - n));
	                // var low = this.low << n;
	            // } else {
	                // var high = this.low << (n - 32);
	                // var low = 0;
	            // }

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Shifts this word n bits to the right.
	         *
	         * @param {number} n The number of bits to shift.
	         *
	         * @return {X64Word} A new x64-Word object after shifting.
	         *
	         * @example
	         *
	         *     var shifted = x64Word.shiftR(7);
	         */
	        // shiftR: function (n) {
	            // if (n < 32) {
	                // var low = (this.low >>> n) | (this.high << (32 - n));
	                // var high = this.high >>> n;
	            // } else {
	                // var low = this.high >>> (n - 32);
	                // var high = 0;
	            // }

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Rotates this word n bits to the left.
	         *
	         * @param {number} n The number of bits to rotate.
	         *
	         * @return {X64Word} A new x64-Word object after rotating.
	         *
	         * @example
	         *
	         *     var rotated = x64Word.rotL(25);
	         */
	        // rotL: function (n) {
	            // return this.shiftL(n).or(this.shiftR(64 - n));
	        // },

	        /**
	         * Rotates this word n bits to the right.
	         *
	         * @param {number} n The number of bits to rotate.
	         *
	         * @return {X64Word} A new x64-Word object after rotating.
	         *
	         * @example
	         *
	         *     var rotated = x64Word.rotR(7);
	         */
	        // rotR: function (n) {
	            // return this.shiftR(n).or(this.shiftL(64 - n));
	        // },

	        /**
	         * Adds this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to add with this word.
	         *
	         * @return {X64Word} A new x64-Word object after adding.
	         *
	         * @example
	         *
	         *     var added = x64Word.add(anotherX64Word);
	         */
	        // add: function (word) {
	            // var low = (this.low + word.low) | 0;
	            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
	            // var high = (this.high + word.high + carry) | 0;

	            // return X64Word.create(high, low);
	        // }
	    });

	    /**
	     * An array of 64-bit words.
	     *
	     * @property {Array} words The array of CryptoJS.x64.Word objects.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var X64WordArray = C_x64.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create();
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create([
	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
	         *     ]);
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create([
	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
	         *     ], 10);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 8;
	            }
	        },

	        /**
	         * Converts this 64-bit word array to a 32-bit word array.
	         *
	         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
	         *
	         * @example
	         *
	         *     var x32WordArray = x64WordArray.toX32();
	         */
	        toX32: function () {
	            // Shortcuts
	            var x64Words = this.words;
	            var x64WordsLength = x64Words.length;

	            // Convert
	            var x32Words = [];
	            for (var i = 0; i < x64WordsLength; i++) {
	                var x64Word = x64Words[i];
	                x32Words.push(x64Word.high);
	                x32Words.push(x64Word.low);
	            }

	            return X32WordArray.create(x32Words, this.sigBytes);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {X64WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = x64WordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);

	            // Clone "words" array
	            var words = clone.words = this.words.slice(0);

	            // Clone each X64Word object
	            var wordsLength = words.length;
	            for (var i = 0; i < wordsLength; i++) {
	                words[i] = words[i].clone();
	            }

	            return clone;
	        }
	    });
	}());


	(function () {
	    // Check if typed arrays are supported
	    if (typeof ArrayBuffer != 'function') {
	        return;
	    }

	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;

	    // Reference original init
	    var superInit = WordArray.init;

	    // Augment WordArray.init to handle typed arrays
	    var subInit = WordArray.init = function (typedArray) {
	        // Convert buffers to uint8
	        if (typedArray instanceof ArrayBuffer) {
	            typedArray = new Uint8Array(typedArray);
	        }

	        // Convert other array views to uint8
	        if (
	            typedArray instanceof Int8Array ||
	            (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
	            typedArray instanceof Int16Array ||
	            typedArray instanceof Uint16Array ||
	            typedArray instanceof Int32Array ||
	            typedArray instanceof Uint32Array ||
	            typedArray instanceof Float32Array ||
	            typedArray instanceof Float64Array
	        ) {
	            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
	        }

	        // Handle Uint8Array
	        if (typedArray instanceof Uint8Array) {
	            // Shortcut
	            var typedArrayByteLength = typedArray.byteLength;

	            // Extract bytes
	            var words = [];
	            for (var i = 0; i < typedArrayByteLength; i++) {
	                words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
	            }

	            // Initialize this word array
	            superInit.call(this, words, typedArrayByteLength);
	        } else {
	            // Else call normal init
	            superInit.apply(this, arguments);
	        }
	    };

	    subInit.prototype = WordArray;
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_enc = C.enc;

	    /**
	     * UTF-16 BE encoding strategy.
	     */
	    var Utf16BE = C_enc.Utf16 = C_enc.Utf16BE = {
	        /**
	         * Converts a word array to a UTF-16 BE string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-16 BE string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var utf16Chars = [];
	            for (var i = 0; i < sigBytes; i += 2) {
	                var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
	                utf16Chars.push(String.fromCharCode(codePoint));
	            }

	            return utf16Chars.join('');
	        },

	        /**
	         * Converts a UTF-16 BE string to a word array.
	         *
	         * @param {string} utf16Str The UTF-16 BE string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
	         */
	        parse: function (utf16Str) {
	            // Shortcut
	            var utf16StrLength = utf16Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < utf16StrLength; i++) {
	                words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
	            }

	            return WordArray.create(words, utf16StrLength * 2);
	        }
	    };

	    /**
	     * UTF-16 LE encoding strategy.
	     */
	    C_enc.Utf16LE = {
	        /**
	         * Converts a word array to a UTF-16 LE string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-16 LE string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var utf16Chars = [];
	            for (var i = 0; i < sigBytes; i += 2) {
	                var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
	                utf16Chars.push(String.fromCharCode(codePoint));
	            }

	            return utf16Chars.join('');
	        },

	        /**
	         * Converts a UTF-16 LE string to a word array.
	         *
	         * @param {string} utf16Str The UTF-16 LE string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
	         */
	        parse: function (utf16Str) {
	            // Shortcut
	            var utf16StrLength = utf16Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < utf16StrLength; i++) {
	                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
	            }

	            return WordArray.create(words, utf16StrLength * 2);
	        }
	    };

	    function swapEndian(word) {
	        return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
	    }
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_enc = C.enc;

	    /**
	     * Base64 encoding strategy.
	     */
	    var Base64 = C_enc.Base64 = {
	        /**
	         * Converts a word array to a Base64 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Base64 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;
	            var map = this._map;

	            // Clamp excess bits
	            wordArray.clamp();

	            // Convert
	            var base64Chars = [];
	            for (var i = 0; i < sigBytes; i += 3) {
	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
	                }
	            }

	            // Add padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                while (base64Chars.length % 4) {
	                    base64Chars.push(paddingChar);
	                }
	            }

	            return base64Chars.join('');
	        },

	        /**
	         * Converts a Base64 string to a word array.
	         *
	         * @param {string} base64Str The Base64 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
	         */
	        parse: function (base64Str) {
	            // Shortcuts
	            var base64StrLength = base64Str.length;
	            var map = this._map;
	            var reverseMap = this._reverseMap;

	            if (!reverseMap) {
	                    reverseMap = this._reverseMap = [];
	                    for (var j = 0; j < map.length; j++) {
	                        reverseMap[map.charCodeAt(j)] = j;
	                    }
	            }

	            // Ignore padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                var paddingIndex = base64Str.indexOf(paddingChar);
	                if (paddingIndex !== -1) {
	                    base64StrLength = paddingIndex;
	                }
	            }

	            // Convert
	            return parseLoop(base64Str, base64StrLength, reverseMap);

	        },

	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	    };

	    function parseLoop(base64Str, base64StrLength, reverseMap) {
	      var words = [];
	      var nBytes = 0;
	      for (var i = 0; i < base64StrLength; i++) {
	          if (i % 4) {
	              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
	              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
	              var bitsCombined = bits1 | bits2;
	              words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
	              nBytes++;
	          }
	      }
	      return WordArray.create(words, nBytes);
	    }
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_enc = C.enc;

	    /**
	     * Base64url encoding strategy.
	     */
	    var Base64url = C_enc.Base64url = {
	        /**
	         * Converts a word array to a Base64url string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @param {boolean} urlSafe Whether to use url safe
	         *
	         * @return {string} The Base64url string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
	         */
	        stringify: function (wordArray, urlSafe) {
	            if (urlSafe === undefined) {
	                urlSafe = true
	            }
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;
	            var map = urlSafe ? this._safe_map : this._map;

	            // Clamp excess bits
	            wordArray.clamp();

	            // Convert
	            var base64Chars = [];
	            for (var i = 0; i < sigBytes; i += 3) {
	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
	                }
	            }

	            // Add padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                while (base64Chars.length % 4) {
	                    base64Chars.push(paddingChar);
	                }
	            }

	            return base64Chars.join('');
	        },

	        /**
	         * Converts a Base64url string to a word array.
	         *
	         * @param {string} base64Str The Base64url string.
	         *
	         * @param {boolean} urlSafe Whether to use url safe
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
	         */
	        parse: function (base64Str, urlSafe) {
	            if (urlSafe === undefined) {
	                urlSafe = true
	            }

	            // Shortcuts
	            var base64StrLength = base64Str.length;
	            var map = urlSafe ? this._safe_map : this._map;
	            var reverseMap = this._reverseMap;

	            if (!reverseMap) {
	                reverseMap = this._reverseMap = [];
	                for (var j = 0; j < map.length; j++) {
	                    reverseMap[map.charCodeAt(j)] = j;
	                }
	            }

	            // Ignore padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                var paddingIndex = base64Str.indexOf(paddingChar);
	                if (paddingIndex !== -1) {
	                    base64StrLength = paddingIndex;
	                }
	            }

	            // Convert
	            return parseLoop(base64Str, base64StrLength, reverseMap);

	        },

	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
	        _safe_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
	    };

	    function parseLoop(base64Str, base64StrLength, reverseMap) {
	        var words = [];
	        var nBytes = 0;
	        for (var i = 0; i < base64StrLength; i++) {
	            if (i % 4) {
	                var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
	                var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
	                var bitsCombined = bits1 | bits2;
	                words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
	                nBytes++;
	            }
	        }
	        return WordArray.create(words, nBytes);
	    }
	}());


	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Constants table
	    var T = [];

	    // Compute constants
	    (function () {
	        for (var i = 0; i < 64; i++) {
	            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
	        }
	    }());

	    /**
	     * MD5 hash algorithm.
	     */
	    var MD5 = C_algo.MD5 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Swap endian
	            for (var i = 0; i < 16; i++) {
	                // Shortcuts
	                var offset_i = offset + i;
	                var M_offset_i = M[offset_i];

	                M[offset_i] = (
	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	                );
	            }

	            // Shortcuts
	            var H = this._hash.words;

	            var M_offset_0  = M[offset + 0];
	            var M_offset_1  = M[offset + 1];
	            var M_offset_2  = M[offset + 2];
	            var M_offset_3  = M[offset + 3];
	            var M_offset_4  = M[offset + 4];
	            var M_offset_5  = M[offset + 5];
	            var M_offset_6  = M[offset + 6];
	            var M_offset_7  = M[offset + 7];
	            var M_offset_8  = M[offset + 8];
	            var M_offset_9  = M[offset + 9];
	            var M_offset_10 = M[offset + 10];
	            var M_offset_11 = M[offset + 11];
	            var M_offset_12 = M[offset + 12];
	            var M_offset_13 = M[offset + 13];
	            var M_offset_14 = M[offset + 14];
	            var M_offset_15 = M[offset + 15];

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];

	            // Computation
	            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
	            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
	            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
	            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
	            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
	            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
	            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
	            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
	            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
	            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
	            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
	            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
	            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
	            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
	            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
	            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

	            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
	            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
	            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
	            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
	            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
	            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
	            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
	            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
	            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
	            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
	            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
	            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
	            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
	            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
	            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
	            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

	            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
	            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
	            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
	            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
	            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
	            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
	            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
	            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
	            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
	            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
	            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
	            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
	            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
	            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
	            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
	            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

	            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
	            d = II(d, a, b, c, M_offset_7,  10, T[49]);
	            c = II(c, d, a, b, M_offset_14, 15, T[50]);
	            b = II(b, c, d, a, M_offset_5,  21, T[51]);
	            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
	            d = II(d, a, b, c, M_offset_3,  10, T[53]);
	            c = II(c, d, a, b, M_offset_10, 15, T[54]);
	            b = II(b, c, d, a, M_offset_1,  21, T[55]);
	            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
	            d = II(d, a, b, c, M_offset_15, 10, T[57]);
	            c = II(c, d, a, b, M_offset_6,  15, T[58]);
	            b = II(b, c, d, a, M_offset_13, 21, T[59]);
	            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
	            d = II(d, a, b, c, M_offset_11, 10, T[61]);
	            c = II(c, d, a, b, M_offset_2,  15, T[62]);
	            b = II(b, c, d, a, M_offset_9,  21, T[63]);

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

	            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
	            var nBitsTotalL = nBitsTotal;
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
	                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
	            );
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
	            );

	            data.sigBytes = (dataWords.length + 1) * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var hash = this._hash;
	            var H = hash.words;

	            // Swap endian
	            for (var i = 0; i < 4; i++) {
	                // Shortcut
	                var H_i = H[i];

	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	            }

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    function FF(a, b, c, d, x, s, t) {
	        var n = a + ((b & c) | (~b & d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function GG(a, b, c, d, x, s, t) {
	        var n = a + ((b & d) | (c & ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function HH(a, b, c, d, x, s, t) {
	        var n = a + (b ^ c ^ d) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function II(a, b, c, d, x, s, t) {
	        var n = a + (c ^ (b | ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.MD5('message');
	     *     var hash = CryptoJS.MD5(wordArray);
	     */
	    C.MD5 = Hasher._createHelper(MD5);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacMD5(message, key);
	     */
	    C.HmacMD5 = Hasher._createHmacHelper(MD5);
	}(Math));


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-1 hash algorithm.
	     */
	    var SHA1 = C_algo.SHA1 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476,
	                0xc3d2e1f0
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];

	            // Computation
	            for (var i = 0; i < 80; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
	                    W[i] = (n << 1) | (n >>> 31);
	                }

	                var t = ((a << 5) | (a >>> 27)) + e + W[i];
	                if (i < 20) {
	                    t += ((b & c) | (~b & d)) + 0x5a827999;
	                } else if (i < 40) {
	                    t += (b ^ c ^ d) + 0x6ed9eba1;
	                } else if (i < 60) {
	                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
	                } else /* if (i < 80) */ {
	                    t += (b ^ c ^ d) - 0x359d3e2a;
	                }

	                e = d;
	                d = c;
	                c = (b << 30) | (b >>> 2);
	                b = a;
	                a = t;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA1('message');
	     *     var hash = CryptoJS.SHA1(wordArray);
	     */
	    C.SHA1 = Hasher._createHelper(SHA1);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA1(message, key);
	     */
	    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
	}());


	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Initialization and round constants tables
	    var H = [];
	    var K = [];

	    // Compute constants
	    (function () {
	        function isPrime(n) {
	            var sqrtN = Math.sqrt(n);
	            for (var factor = 2; factor <= sqrtN; factor++) {
	                if (!(n % factor)) {
	                    return false;
	                }
	            }

	            return true;
	        }

	        function getFractionalBits(n) {
	            return ((n - (n | 0)) * 0x100000000) | 0;
	        }

	        var n = 2;
	        var nPrime = 0;
	        while (nPrime < 64) {
	            if (isPrime(n)) {
	                if (nPrime < 8) {
	                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
	                }
	                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

	                nPrime++;
	            }

	            n++;
	        }
	    }());

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-256 hash algorithm.
	     */
	    var SHA256 = C_algo.SHA256 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init(H.slice(0));
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];
	            var f = H[5];
	            var g = H[6];
	            var h = H[7];

	            // Computation
	            for (var i = 0; i < 64; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var gamma0x = W[i - 15];
	                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
	                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
	                                   (gamma0x >>> 3);

	                    var gamma1x = W[i - 2];
	                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
	                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
	                                   (gamma1x >>> 10);

	                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
	                }

	                var ch  = (e & f) ^ (~e & g);
	                var maj = (a & b) ^ (a & c) ^ (b & c);

	                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
	                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

	                var t1 = h + sigma1 + ch + K[i] + W[i];
	                var t2 = sigma0 + maj;

	                h = g;
	                g = f;
	                f = e;
	                e = (d + t1) | 0;
	                d = c;
	                c = b;
	                b = a;
	                a = (t1 + t2) | 0;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	            H[5] = (H[5] + f) | 0;
	            H[6] = (H[6] + g) | 0;
	            H[7] = (H[7] + h) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA256('message');
	     *     var hash = CryptoJS.SHA256(wordArray);
	     */
	    C.SHA256 = Hasher._createHelper(SHA256);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA256(message, key);
	     */
	    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
	}(Math));


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_algo = C.algo;
	    var SHA256 = C_algo.SHA256;

	    /**
	     * SHA-224 hash algorithm.
	     */
	    var SHA224 = C_algo.SHA224 = SHA256.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
	                0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
	            ]);
	        },

	        _doFinalize: function () {
	            var hash = SHA256._doFinalize.call(this);

	            hash.sigBytes -= 4;

	            return hash;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA224('message');
	     *     var hash = CryptoJS.SHA224(wordArray);
	     */
	    C.SHA224 = SHA256._createHelper(SHA224);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA224(message, key);
	     */
	    C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Hasher = C_lib.Hasher;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var X64WordArray = C_x64.WordArray;
	    var C_algo = C.algo;

	    function X64Word_create() {
	        return X64Word.create.apply(X64Word, arguments);
	    }

	    // Constants
	    var K = [
	        X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
	        X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
	        X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
	        X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
	        X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
	        X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
	        X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
	        X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
	        X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
	        X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
	        X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
	        X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
	        X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
	        X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
	        X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
	        X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
	        X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
	        X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
	        X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
	        X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
	        X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
	        X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
	        X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
	        X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
	        X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
	        X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
	        X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
	        X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
	        X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
	        X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
	        X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
	        X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
	        X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
	        X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
	        X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
	        X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
	        X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
	        X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
	        X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
	        X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
	    ];

	    // Reusable objects
	    var W = [];
	    (function () {
	        for (var i = 0; i < 80; i++) {
	            W[i] = X64Word_create();
	        }
	    }());

	    /**
	     * SHA-512 hash algorithm.
	     */
	    var SHA512 = C_algo.SHA512 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new X64WordArray.init([
	                new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
	                new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
	                new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
	                new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcuts
	            var H = this._hash.words;

	            var H0 = H[0];
	            var H1 = H[1];
	            var H2 = H[2];
	            var H3 = H[3];
	            var H4 = H[4];
	            var H5 = H[5];
	            var H6 = H[6];
	            var H7 = H[7];

	            var H0h = H0.high;
	            var H0l = H0.low;
	            var H1h = H1.high;
	            var H1l = H1.low;
	            var H2h = H2.high;
	            var H2l = H2.low;
	            var H3h = H3.high;
	            var H3l = H3.low;
	            var H4h = H4.high;
	            var H4l = H4.low;
	            var H5h = H5.high;
	            var H5l = H5.low;
	            var H6h = H6.high;
	            var H6l = H6.low;
	            var H7h = H7.high;
	            var H7l = H7.low;

	            // Working variables
	            var ah = H0h;
	            var al = H0l;
	            var bh = H1h;
	            var bl = H1l;
	            var ch = H2h;
	            var cl = H2l;
	            var dh = H3h;
	            var dl = H3l;
	            var eh = H4h;
	            var el = H4l;
	            var fh = H5h;
	            var fl = H5l;
	            var gh = H6h;
	            var gl = H6l;
	            var hh = H7h;
	            var hl = H7l;

	            // Rounds
	            for (var i = 0; i < 80; i++) {
	                var Wil;
	                var Wih;

	                // Shortcut
	                var Wi = W[i];

	                // Extend message
	                if (i < 16) {
	                    Wih = Wi.high = M[offset + i * 2]     | 0;
	                    Wil = Wi.low  = M[offset + i * 2 + 1] | 0;
	                } else {
	                    // Gamma0
	                    var gamma0x  = W[i - 15];
	                    var gamma0xh = gamma0x.high;
	                    var gamma0xl = gamma0x.low;
	                    var gamma0h  = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
	                    var gamma0l  = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));

	                    // Gamma1
	                    var gamma1x  = W[i - 2];
	                    var gamma1xh = gamma1x.high;
	                    var gamma1xl = gamma1x.low;
	                    var gamma1h  = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
	                    var gamma1l  = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));

	                    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	                    var Wi7  = W[i - 7];
	                    var Wi7h = Wi7.high;
	                    var Wi7l = Wi7.low;

	                    var Wi16  = W[i - 16];
	                    var Wi16h = Wi16.high;
	                    var Wi16l = Wi16.low;

	                    Wil = gamma0l + Wi7l;
	                    Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
	                    Wil = Wil + gamma1l;
	                    Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
	                    Wil = Wil + Wi16l;
	                    Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);

	                    Wi.high = Wih;
	                    Wi.low  = Wil;
	                }

	                var chh  = (eh & fh) ^ (~eh & gh);
	                var chl  = (el & fl) ^ (~el & gl);
	                var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
	                var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

	                var sigma0h = ((ah >>> 28) | (al << 4))  ^ ((ah << 30)  | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
	                var sigma0l = ((al >>> 28) | (ah << 4))  ^ ((al << 30)  | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
	                var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
	                var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

	                // t1 = h + sigma1 + ch + K[i] + W[i]
	                var Ki  = K[i];
	                var Kih = Ki.high;
	                var Kil = Ki.low;

	                var t1l = hl + sigma1l;
	                var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
	                var t1l = t1l + chl;
	                var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
	                var t1l = t1l + Kil;
	                var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
	                var t1l = t1l + Wil;
	                var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);

	                // t2 = sigma0 + maj
	                var t2l = sigma0l + majl;
	                var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

	                // Update working variables
	                hh = gh;
	                hl = gl;
	                gh = fh;
	                gl = fl;
	                fh = eh;
	                fl = el;
	                el = (dl + t1l) | 0;
	                eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
	                dh = ch;
	                dl = cl;
	                ch = bh;
	                cl = bl;
	                bh = ah;
	                bl = al;
	                al = (t1l + t2l) | 0;
	                ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
	            }

	            // Intermediate hash value
	            H0l = H0.low  = (H0l + al);
	            H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
	            H1l = H1.low  = (H1l + bl);
	            H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
	            H2l = H2.low  = (H2l + cl);
	            H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
	            H3l = H3.low  = (H3l + dl);
	            H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
	            H4l = H4.low  = (H4l + el);
	            H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
	            H5l = H5.low  = (H5l + fl);
	            H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
	            H6l = H6.low  = (H6l + gl);
	            H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
	            H7l = H7.low  = (H7l + hl);
	            H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Convert hash to 32-bit word array before returning
	            var hash = this._hash.toX32();

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        },

	        blockSize: 1024/32
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA512('message');
	     *     var hash = CryptoJS.SHA512(wordArray);
	     */
	    C.SHA512 = Hasher._createHelper(SHA512);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA512(message, key);
	     */
	    C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var X64WordArray = C_x64.WordArray;
	    var C_algo = C.algo;
	    var SHA512 = C_algo.SHA512;

	    /**
	     * SHA-384 hash algorithm.
	     */
	    var SHA384 = C_algo.SHA384 = SHA512.extend({
	        _doReset: function () {
	            this._hash = new X64WordArray.init([
	                new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
	                new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
	                new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
	                new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
	            ]);
	        },

	        _doFinalize: function () {
	            var hash = SHA512._doFinalize.call(this);

	            hash.sigBytes -= 16;

	            return hash;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA384('message');
	     *     var hash = CryptoJS.SHA384(wordArray);
	     */
	    C.SHA384 = SHA512._createHelper(SHA384);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA384(message, key);
	     */
	    C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
	}());


	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var C_algo = C.algo;

	    // Constants tables
	    var RHO_OFFSETS = [];
	    var PI_INDEXES  = [];
	    var ROUND_CONSTANTS = [];

	    // Compute Constants
	    (function () {
	        // Compute rho offset constants
	        var x = 1, y = 0;
	        for (var t = 0; t < 24; t++) {
	            RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

	            var newX = y % 5;
	            var newY = (2 * x + 3 * y) % 5;
	            x = newX;
	            y = newY;
	        }

	        // Compute pi index constants
	        for (var x = 0; x < 5; x++) {
	            for (var y = 0; y < 5; y++) {
	                PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
	            }
	        }

	        // Compute round constants
	        var LFSR = 0x01;
	        for (var i = 0; i < 24; i++) {
	            var roundConstantMsw = 0;
	            var roundConstantLsw = 0;

	            for (var j = 0; j < 7; j++) {
	                if (LFSR & 0x01) {
	                    var bitPosition = (1 << j) - 1;
	                    if (bitPosition < 32) {
	                        roundConstantLsw ^= 1 << bitPosition;
	                    } else /* if (bitPosition >= 32) */ {
	                        roundConstantMsw ^= 1 << (bitPosition - 32);
	                    }
	                }

	                // Compute next LFSR
	                if (LFSR & 0x80) {
	                    // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
	                    LFSR = (LFSR << 1) ^ 0x71;
	                } else {
	                    LFSR <<= 1;
	                }
	            }

	            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
	        }
	    }());

	    // Reusable objects for temporary values
	    var T = [];
	    (function () {
	        for (var i = 0; i < 25; i++) {
	            T[i] = X64Word.create();
	        }
	    }());

	    /**
	     * SHA-3 hash algorithm.
	     */
	    var SHA3 = C_algo.SHA3 = Hasher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} outputLength
	         *   The desired number of bits in the output hash.
	         *   Only values permitted are: 224, 256, 384, 512.
	         *   Default: 512
	         */
	        cfg: Hasher.cfg.extend({
	            outputLength: 512
	        }),

	        _doReset: function () {
	            var state = this._state = []
	            for (var i = 0; i < 25; i++) {
	                state[i] = new X64Word.init();
	            }

	            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcuts
	            var state = this._state;
	            var nBlockSizeLanes = this.blockSize / 2;

	            // Absorb
	            for (var i = 0; i < nBlockSizeLanes; i++) {
	                // Shortcuts
	                var M2i  = M[offset + 2 * i];
	                var M2i1 = M[offset + 2 * i + 1];

	                // Swap endian
	                M2i = (
	                    (((M2i << 8)  | (M2i >>> 24)) & 0x00ff00ff) |
	                    (((M2i << 24) | (M2i >>> 8))  & 0xff00ff00)
	                );
	                M2i1 = (
	                    (((M2i1 << 8)  | (M2i1 >>> 24)) & 0x00ff00ff) |
	                    (((M2i1 << 24) | (M2i1 >>> 8))  & 0xff00ff00)
	                );

	                // Absorb message into state
	                var lane = state[i];
	                lane.high ^= M2i1;
	                lane.low  ^= M2i;
	            }

	            // Rounds
	            for (var round = 0; round < 24; round++) {
	                // Theta
	                for (var x = 0; x < 5; x++) {
	                    // Mix column lanes
	                    var tMsw = 0, tLsw = 0;
	                    for (var y = 0; y < 5; y++) {
	                        var lane = state[x + 5 * y];
	                        tMsw ^= lane.high;
	                        tLsw ^= lane.low;
	                    }

	                    // Temporary values
	                    var Tx = T[x];
	                    Tx.high = tMsw;
	                    Tx.low  = tLsw;
	                }
	                for (var x = 0; x < 5; x++) {
	                    // Shortcuts
	                    var Tx4 = T[(x + 4) % 5];
	                    var Tx1 = T[(x + 1) % 5];
	                    var Tx1Msw = Tx1.high;
	                    var Tx1Lsw = Tx1.low;

	                    // Mix surrounding columns
	                    var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
	                    var tLsw = Tx4.low  ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
	                    for (var y = 0; y < 5; y++) {
	                        var lane = state[x + 5 * y];
	                        lane.high ^= tMsw;
	                        lane.low  ^= tLsw;
	                    }
	                }

	                // Rho Pi
	                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
	                    var tMsw;
	                    var tLsw;

	                    // Shortcuts
	                    var lane = state[laneIndex];
	                    var laneMsw = lane.high;
	                    var laneLsw = lane.low;
	                    var rhoOffset = RHO_OFFSETS[laneIndex];

	                    // Rotate lanes
	                    if (rhoOffset < 32) {
	                        tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
	                        tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
	                    } else /* if (rhoOffset >= 32) */ {
	                        tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
	                        tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
	                    }

	                    // Transpose lanes
	                    var TPiLane = T[PI_INDEXES[laneIndex]];
	                    TPiLane.high = tMsw;
	                    TPiLane.low  = tLsw;
	                }

	                // Rho pi at x = y = 0
	                var T0 = T[0];
	                var state0 = state[0];
	                T0.high = state0.high;
	                T0.low  = state0.low;

	                // Chi
	                for (var x = 0; x < 5; x++) {
	                    for (var y = 0; y < 5; y++) {
	                        // Shortcuts
	                        var laneIndex = x + 5 * y;
	                        var lane = state[laneIndex];
	                        var TLane = T[laneIndex];
	                        var Tx1Lane = T[((x + 1) % 5) + 5 * y];
	                        var Tx2Lane = T[((x + 2) % 5) + 5 * y];

	                        // Mix rows
	                        lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
	                        lane.low  = TLane.low  ^ (~Tx1Lane.low  & Tx2Lane.low);
	                    }
	                }

	                // Iota
	                var lane = state[0];
	                var roundConstant = ROUND_CONSTANTS[round];
	                lane.high ^= roundConstant.high;
	                lane.low  ^= roundConstant.low;
	            }
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;
	            var blockSizeBits = this.blockSize * 32;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
	            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var state = this._state;
	            var outputLengthBytes = this.cfg.outputLength / 8;
	            var outputLengthLanes = outputLengthBytes / 8;

	            // Squeeze
	            var hashWords = [];
	            for (var i = 0; i < outputLengthLanes; i++) {
	                // Shortcuts
	                var lane = state[i];
	                var laneMsw = lane.high;
	                var laneLsw = lane.low;

	                // Swap endian
	                laneMsw = (
	                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
	                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
	                );
	                laneLsw = (
	                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
	                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
	                );

	                // Squeeze state to retrieve hash
	                hashWords.push(laneLsw);
	                hashWords.push(laneMsw);
	            }

	            // Return final computed hash
	            return new WordArray.init(hashWords, outputLengthBytes);
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);

	            var state = clone._state = this._state.slice(0);
	            for (var i = 0; i < 25; i++) {
	                state[i] = state[i].clone();
	            }

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA3('message');
	     *     var hash = CryptoJS.SHA3(wordArray);
	     */
	    C.SHA3 = Hasher._createHelper(SHA3);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA3(message, key);
	     */
	    C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
	}(Math));


	/** @preserve
	(c) 2012 by Cédric Mesnil. All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Constants table
	    var _zl = WordArray.create([
	        0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
	        7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
	        3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
	        1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
	        4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13]);
	    var _zr = WordArray.create([
	        5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
	        6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
	        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
	        8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
	        12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11]);
	    var _sl = WordArray.create([
	         11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
	        7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
	        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
	          11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
	        9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ]);
	    var _sr = WordArray.create([
	        8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
	        9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
	        9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
	        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
	        8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ]);

	    var _hl =  WordArray.create([ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
	    var _hr =  WordArray.create([ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

	    /**
	     * RIPEMD160 hash algorithm.
	     */
	    var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
	        _doReset: function () {
	            this._hash  = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
	        },

	        _doProcessBlock: function (M, offset) {

	            // Swap endian
	            for (var i = 0; i < 16; i++) {
	                // Shortcuts
	                var offset_i = offset + i;
	                var M_offset_i = M[offset_i];

	                // Swap
	                M[offset_i] = (
	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	                );
	            }
	            // Shortcut
	            var H  = this._hash.words;
	            var hl = _hl.words;
	            var hr = _hr.words;
	            var zl = _zl.words;
	            var zr = _zr.words;
	            var sl = _sl.words;
	            var sr = _sr.words;

	            // Working variables
	            var al, bl, cl, dl, el;
	            var ar, br, cr, dr, er;

	            ar = al = H[0];
	            br = bl = H[1];
	            cr = cl = H[2];
	            dr = dl = H[3];
	            er = el = H[4];
	            // Computation
	            var t;
	            for (var i = 0; i < 80; i += 1) {
	                t = (al +  M[offset+zl[i]])|0;
	                if (i<16){
		            t +=  f1(bl,cl,dl) + hl[0];
	                } else if (i<32) {
		            t +=  f2(bl,cl,dl) + hl[1];
	                } else if (i<48) {
		            t +=  f3(bl,cl,dl) + hl[2];
	                } else if (i<64) {
		            t +=  f4(bl,cl,dl) + hl[3];
	                } else {// if (i<80) {
		            t +=  f5(bl,cl,dl) + hl[4];
	                }
	                t = t|0;
	                t =  rotl(t,sl[i]);
	                t = (t+el)|0;
	                al = el;
	                el = dl;
	                dl = rotl(cl, 10);
	                cl = bl;
	                bl = t;

	                t = (ar + M[offset+zr[i]])|0;
	                if (i<16){
		            t +=  f5(br,cr,dr) + hr[0];
	                } else if (i<32) {
		            t +=  f4(br,cr,dr) + hr[1];
	                } else if (i<48) {
		            t +=  f3(br,cr,dr) + hr[2];
	                } else if (i<64) {
		            t +=  f2(br,cr,dr) + hr[3];
	                } else {// if (i<80) {
		            t +=  f1(br,cr,dr) + hr[4];
	                }
	                t = t|0;
	                t =  rotl(t,sr[i]) ;
	                t = (t+er)|0;
	                ar = er;
	                er = dr;
	                dr = rotl(cr, 10);
	                cr = br;
	                br = t;
	            }
	            // Intermediate hash value
	            t    = (H[1] + cl + dr)|0;
	            H[1] = (H[2] + dl + er)|0;
	            H[2] = (H[3] + el + ar)|0;
	            H[3] = (H[4] + al + br)|0;
	            H[4] = (H[0] + bl + cr)|0;
	            H[0] =  t;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	                (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
	            );
	            data.sigBytes = (dataWords.length + 1) * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var hash = this._hash;
	            var H = hash.words;

	            // Swap endian
	            for (var i = 0; i < 5; i++) {
	                // Shortcut
	                var H_i = H[i];

	                // Swap
	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	            }

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });


	    function f1(x, y, z) {
	        return ((x) ^ (y) ^ (z));

	    }

	    function f2(x, y, z) {
	        return (((x)&(y)) | ((~x)&(z)));
	    }

	    function f3(x, y, z) {
	        return (((x) | (~(y))) ^ (z));
	    }

	    function f4(x, y, z) {
	        return (((x) & (z)) | ((y)&(~(z))));
	    }

	    function f5(x, y, z) {
	        return ((x) ^ ((y) |(~(z))));

	    }

	    function rotl(x,n) {
	        return (x<<n) | (x>>>(32-n));
	    }


	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.RIPEMD160('message');
	     *     var hash = CryptoJS.RIPEMD160(wordArray);
	     */
	    C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
	     */
	    C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
	}(Math));


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var C_enc = C.enc;
	    var Utf8 = C_enc.Utf8;
	    var C_algo = C.algo;

	    /**
	     * HMAC algorithm.
	     */
	    var HMAC = C_algo.HMAC = Base.extend({
	        /**
	         * Initializes a newly created HMAC.
	         *
	         * @param {Hasher} hasher The hash algorithm to use.
	         * @param {WordArray|string} key The secret key.
	         *
	         * @example
	         *
	         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
	         */
	        init: function (hasher, key) {
	            // Init hasher
	            hasher = this._hasher = new hasher.init();

	            // Convert string to WordArray, else assume WordArray already
	            if (typeof key == 'string') {
	                key = Utf8.parse(key);
	            }

	            // Shortcuts
	            var hasherBlockSize = hasher.blockSize;
	            var hasherBlockSizeBytes = hasherBlockSize * 4;

	            // Allow arbitrary length keys
	            if (key.sigBytes > hasherBlockSizeBytes) {
	                key = hasher.finalize(key);
	            }

	            // Clamp excess bits
	            key.clamp();

	            // Clone key for inner and outer pads
	            var oKey = this._oKey = key.clone();
	            var iKey = this._iKey = key.clone();

	            // Shortcuts
	            var oKeyWords = oKey.words;
	            var iKeyWords = iKey.words;

	            // XOR keys with pad constants
	            for (var i = 0; i < hasherBlockSize; i++) {
	                oKeyWords[i] ^= 0x5c5c5c5c;
	                iKeyWords[i] ^= 0x36363636;
	            }
	            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this HMAC to its initial state.
	         *
	         * @example
	         *
	         *     hmacHasher.reset();
	         */
	        reset: function () {
	            // Shortcut
	            var hasher = this._hasher;

	            // Reset
	            hasher.reset();
	            hasher.update(this._iKey);
	        },

	        /**
	         * Updates this HMAC with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {HMAC} This HMAC instance.
	         *
	         * @example
	         *
	         *     hmacHasher.update('message');
	         *     hmacHasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            this._hasher.update(messageUpdate);

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the HMAC computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The HMAC.
	         *
	         * @example
	         *
	         *     var hmac = hmacHasher.finalize();
	         *     var hmac = hmacHasher.finalize('message');
	         *     var hmac = hmacHasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Shortcut
	            var hasher = this._hasher;

	            // Compute HMAC
	            var innerHash = hasher.finalize(messageUpdate);
	            hasher.reset();
	            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

	            return hmac;
	        }
	    });
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var WordArray = C_lib.WordArray;
	    var C_algo = C.algo;
	    var SHA256 = C_algo.SHA256;
	    var HMAC = C_algo.HMAC;

	    /**
	     * Password-Based Key Derivation Function 2 algorithm.
	     */
	    var PBKDF2 = C_algo.PBKDF2 = Base.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
	         * @property {Hasher} hasher The hasher to use. Default: SHA256
	         * @property {number} iterations The number of iterations to perform. Default: 250000
	         */
	        cfg: Base.extend({
	            keySize: 128/32,
	            hasher: SHA256,
	            iterations: 250000
	        }),

	        /**
	         * Initializes a newly created key derivation function.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
	         *
	         * @example
	         *
	         *     var kdf = CryptoJS.algo.PBKDF2.create();
	         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
	         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
	         */
	        init: function (cfg) {
	            this.cfg = this.cfg.extend(cfg);
	        },

	        /**
	         * Computes the Password-Based Key Derivation Function 2.
	         *
	         * @param {WordArray|string} password The password.
	         * @param {WordArray|string} salt A salt.
	         *
	         * @return {WordArray} The derived key.
	         *
	         * @example
	         *
	         *     var key = kdf.compute(password, salt);
	         */
	        compute: function (password, salt) {
	            // Shortcut
	            var cfg = this.cfg;

	            // Init HMAC
	            var hmac = HMAC.create(cfg.hasher, password);

	            // Initial values
	            var derivedKey = WordArray.create();
	            var blockIndex = WordArray.create([0x00000001]);

	            // Shortcuts
	            var derivedKeyWords = derivedKey.words;
	            var blockIndexWords = blockIndex.words;
	            var keySize = cfg.keySize;
	            var iterations = cfg.iterations;

	            // Generate key
	            while (derivedKeyWords.length < keySize) {
	                var block = hmac.update(salt).finalize(blockIndex);
	                hmac.reset();

	                // Shortcuts
	                var blockWords = block.words;
	                var blockWordsLength = blockWords.length;

	                // Iterations
	                var intermediate = block;
	                for (var i = 1; i < iterations; i++) {
	                    intermediate = hmac.finalize(intermediate);
	                    hmac.reset();

	                    // Shortcut
	                    var intermediateWords = intermediate.words;

	                    // XOR intermediate with block
	                    for (var j = 0; j < blockWordsLength; j++) {
	                        blockWords[j] ^= intermediateWords[j];
	                    }
	                }

	                derivedKey.concat(block);
	                blockIndexWords[0]++;
	            }
	            derivedKey.sigBytes = keySize * 4;

	            return derivedKey;
	        }
	    });

	    /**
	     * Computes the Password-Based Key Derivation Function 2.
	     *
	     * @param {WordArray|string} password The password.
	     * @param {WordArray|string} salt A salt.
	     * @param {Object} cfg (Optional) The configuration options to use for this computation.
	     *
	     * @return {WordArray} The derived key.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var key = CryptoJS.PBKDF2(password, salt);
	     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
	     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
	     */
	    C.PBKDF2 = function (password, salt, cfg) {
	        return PBKDF2.create(cfg).compute(password, salt);
	    };
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var WordArray = C_lib.WordArray;
	    var C_algo = C.algo;
	    var MD5 = C_algo.MD5;

	    /**
	     * This key derivation function is meant to conform with EVP_BytesToKey.
	     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
	     */
	    var EvpKDF = C_algo.EvpKDF = Base.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
	         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
	         * @property {number} iterations The number of iterations to perform. Default: 1
	         */
	        cfg: Base.extend({
	            keySize: 128/32,
	            hasher: MD5,
	            iterations: 1
	        }),

	        /**
	         * Initializes a newly created key derivation function.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
	         *
	         * @example
	         *
	         *     var kdf = CryptoJS.algo.EvpKDF.create();
	         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
	         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
	         */
	        init: function (cfg) {
	            this.cfg = this.cfg.extend(cfg);
	        },

	        /**
	         * Derives a key from a password.
	         *
	         * @param {WordArray|string} password The password.
	         * @param {WordArray|string} salt A salt.
	         *
	         * @return {WordArray} The derived key.
	         *
	         * @example
	         *
	         *     var key = kdf.compute(password, salt);
	         */
	        compute: function (password, salt) {
	            var block;

	            // Shortcut
	            var cfg = this.cfg;

	            // Init hasher
	            var hasher = cfg.hasher.create();

	            // Initial values
	            var derivedKey = WordArray.create();

	            // Shortcuts
	            var derivedKeyWords = derivedKey.words;
	            var keySize = cfg.keySize;
	            var iterations = cfg.iterations;

	            // Generate key
	            while (derivedKeyWords.length < keySize) {
	                if (block) {
	                    hasher.update(block);
	                }
	                block = hasher.update(password).finalize(salt);
	                hasher.reset();

	                // Iterations
	                for (var i = 1; i < iterations; i++) {
	                    block = hasher.finalize(block);
	                    hasher.reset();
	                }

	                derivedKey.concat(block);
	            }
	            derivedKey.sigBytes = keySize * 4;

	            return derivedKey;
	        }
	    });

	    /**
	     * Derives a key from a password.
	     *
	     * @param {WordArray|string} password The password.
	     * @param {WordArray|string} salt A salt.
	     * @param {Object} cfg (Optional) The configuration options to use for this computation.
	     *
	     * @return {WordArray} The derived key.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var key = CryptoJS.EvpKDF(password, salt);
	     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
	     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
	     */
	    C.EvpKDF = function (password, salt, cfg) {
	        return EvpKDF.create(cfg).compute(password, salt);
	    };
	}());


	/**
	 * Cipher core components.
	 */
	CryptoJS.lib.Cipher || (function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var WordArray = C_lib.WordArray;
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
	    var C_enc = C.enc;
	    var Utf8 = C_enc.Utf8;
	    var Base64 = C_enc.Base64;
	    var C_algo = C.algo;
	    var EvpKDF = C_algo.EvpKDF;

	    /**
	     * Abstract base cipher template.
	     *
	     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
	     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
	     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
	     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
	     */
	    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {WordArray} iv The IV to use for this operation.
	         */
	        cfg: Base.extend(),

	        /**
	         * Creates this cipher in encryption mode.
	         *
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {Cipher} A cipher instance.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
	         */
	        createEncryptor: function (key, cfg) {
	            return this.create(this._ENC_XFORM_MODE, key, cfg);
	        },

	        /**
	         * Creates this cipher in decryption mode.
	         *
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {Cipher} A cipher instance.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
	         */
	        createDecryptor: function (key, cfg) {
	            return this.create(this._DEC_XFORM_MODE, key, cfg);
	        },

	        /**
	         * Initializes a newly created cipher.
	         *
	         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @example
	         *
	         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
	         */
	        init: function (xformMode, key, cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Store transform mode and key
	            this._xformMode = xformMode;
	            this._key = key;

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this cipher to its initial state.
	         *
	         * @example
	         *
	         *     cipher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-cipher logic
	            this._doReset();
	        },

	        /**
	         * Adds data to be encrypted or decrypted.
	         *
	         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
	         *
	         * @return {WordArray} The data after processing.
	         *
	         * @example
	         *
	         *     var encrypted = cipher.process('data');
	         *     var encrypted = cipher.process(wordArray);
	         */
	        process: function (dataUpdate) {
	            // Append
	            this._append(dataUpdate);

	            // Process available blocks
	            return this._process();
	        },

	        /**
	         * Finalizes the encryption or decryption process.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
	         *
	         * @return {WordArray} The data after final processing.
	         *
	         * @example
	         *
	         *     var encrypted = cipher.finalize();
	         *     var encrypted = cipher.finalize('data');
	         *     var encrypted = cipher.finalize(wordArray);
	         */
	        finalize: function (dataUpdate) {
	            // Final data update
	            if (dataUpdate) {
	                this._append(dataUpdate);
	            }

	            // Perform concrete-cipher logic
	            var finalProcessedData = this._doFinalize();

	            return finalProcessedData;
	        },

	        keySize: 128/32,

	        ivSize: 128/32,

	        _ENC_XFORM_MODE: 1,

	        _DEC_XFORM_MODE: 2,

	        /**
	         * Creates shortcut functions to a cipher's object interface.
	         *
	         * @param {Cipher} cipher The cipher to create a helper for.
	         *
	         * @return {Object} An object with encrypt and decrypt shortcut functions.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
	         */
	        _createHelper: (function () {
	            function selectCipherStrategy(key) {
	                if (typeof key == 'string') {
	                    return PasswordBasedCipher;
	                } else {
	                    return SerializableCipher;
	                }
	            }

	            return function (cipher) {
	                return {
	                    encrypt: function (message, key, cfg) {
	                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
	                    },

	                    decrypt: function (ciphertext, key, cfg) {
	                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
	                    }
	                };
	            };
	        }())
	    });

	    /**
	     * Abstract base stream cipher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
	     */
	    var StreamCipher = C_lib.StreamCipher = Cipher.extend({
	        _doFinalize: function () {
	            // Process partial blocks
	            var finalProcessedBlocks = this._process(!!'flush');

	            return finalProcessedBlocks;
	        },

	        blockSize: 1
	    });

	    /**
	     * Mode namespace.
	     */
	    var C_mode = C.mode = {};

	    /**
	     * Abstract base block cipher mode template.
	     */
	    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
	        /**
	         * Creates this mode for encryption.
	         *
	         * @param {Cipher} cipher A block cipher instance.
	         * @param {Array} iv The IV words.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
	         */
	        createEncryptor: function (cipher, iv) {
	            return this.Encryptor.create(cipher, iv);
	        },

	        /**
	         * Creates this mode for decryption.
	         *
	         * @param {Cipher} cipher A block cipher instance.
	         * @param {Array} iv The IV words.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
	         */
	        createDecryptor: function (cipher, iv) {
	            return this.Decryptor.create(cipher, iv);
	        },

	        /**
	         * Initializes a newly created mode.
	         *
	         * @param {Cipher} cipher A block cipher instance.
	         * @param {Array} iv The IV words.
	         *
	         * @example
	         *
	         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
	         */
	        init: function (cipher, iv) {
	            this._cipher = cipher;
	            this._iv = iv;
	        }
	    });

	    /**
	     * Cipher Block Chaining mode.
	     */
	    var CBC = C_mode.CBC = (function () {
	        /**
	         * Abstract base CBC mode.
	         */
	        var CBC = BlockCipherMode.extend();

	        /**
	         * CBC encryptor.
	         */
	        CBC.Encryptor = CBC.extend({
	            /**
	             * Processes the data block at offset.
	             *
	             * @param {Array} words The data words to operate on.
	             * @param {number} offset The offset where the block starts.
	             *
	             * @example
	             *
	             *     mode.processBlock(data.words, offset);
	             */
	            processBlock: function (words, offset) {
	                // Shortcuts
	                var cipher = this._cipher;
	                var blockSize = cipher.blockSize;

	                // XOR and encrypt
	                xorBlock.call(this, words, offset, blockSize);
	                cipher.encryptBlock(words, offset);

	                // Remember this block to use with next block
	                this._prevBlock = words.slice(offset, offset + blockSize);
	            }
	        });

	        /**
	         * CBC decryptor.
	         */
	        CBC.Decryptor = CBC.extend({
	            /**
	             * Processes the data block at offset.
	             *
	             * @param {Array} words The data words to operate on.
	             * @param {number} offset The offset where the block starts.
	             *
	             * @example
	             *
	             *     mode.processBlock(data.words, offset);
	             */
	            processBlock: function (words, offset) {
	                // Shortcuts
	                var cipher = this._cipher;
	                var blockSize = cipher.blockSize;

	                // Remember this block to use with next block
	                var thisBlock = words.slice(offset, offset + blockSize);

	                // Decrypt and XOR
	                cipher.decryptBlock(words, offset);
	                xorBlock.call(this, words, offset, blockSize);

	                // This block becomes the previous block
	                this._prevBlock = thisBlock;
	            }
	        });

	        function xorBlock(words, offset, blockSize) {
	            var block;

	            // Shortcut
	            var iv = this._iv;

	            // Choose mixing block
	            if (iv) {
	                block = iv;

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            } else {
	                block = this._prevBlock;
	            }

	            // XOR blocks
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= block[i];
	            }
	        }

	        return CBC;
	    }());

	    /**
	     * Padding namespace.
	     */
	    var C_pad = C.pad = {};

	    /**
	     * PKCS #5/7 padding strategy.
	     */
	    var Pkcs7 = C_pad.Pkcs7 = {
	        /**
	         * Pads data using the algorithm defined in PKCS #5/7.
	         *
	         * @param {WordArray} data The data to pad.
	         * @param {number} blockSize The multiple that the data should be padded to.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
	         */
	        pad: function (data, blockSize) {
	            // Shortcut
	            var blockSizeBytes = blockSize * 4;

	            // Count padding bytes
	            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

	            // Create padding word
	            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

	            // Create padding
	            var paddingWords = [];
	            for (var i = 0; i < nPaddingBytes; i += 4) {
	                paddingWords.push(paddingWord);
	            }
	            var padding = WordArray.create(paddingWords, nPaddingBytes);

	            // Add padding
	            data.concat(padding);
	        },

	        /**
	         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
	         *
	         * @param {WordArray} data The data to unpad.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
	         */
	        unpad: function (data) {
	            // Get number of padding bytes from last byte
	            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

	            // Remove padding
	            data.sigBytes -= nPaddingBytes;
	        }
	    };

	    /**
	     * Abstract base block cipher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
	     */
	    var BlockCipher = C_lib.BlockCipher = Cipher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {Mode} mode The block mode to use. Default: CBC
	         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
	         */
	        cfg: Cipher.cfg.extend({
	            mode: CBC,
	            padding: Pkcs7
	        }),

	        reset: function () {
	            var modeCreator;

	            // Reset cipher
	            Cipher.reset.call(this);

	            // Shortcuts
	            var cfg = this.cfg;
	            var iv = cfg.iv;
	            var mode = cfg.mode;

	            // Reset block mode
	            if (this._xformMode == this._ENC_XFORM_MODE) {
	                modeCreator = mode.createEncryptor;
	            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
	                modeCreator = mode.createDecryptor;
	                // Keep at least one block in the buffer for unpadding
	                this._minBufferSize = 1;
	            }

	            if (this._mode && this._mode.__creator == modeCreator) {
	                this._mode.init(this, iv && iv.words);
	            } else {
	                this._mode = modeCreator.call(mode, this, iv && iv.words);
	                this._mode.__creator = modeCreator;
	            }
	        },

	        _doProcessBlock: function (words, offset) {
	            this._mode.processBlock(words, offset);
	        },

	        _doFinalize: function () {
	            var finalProcessedBlocks;

	            // Shortcut
	            var padding = this.cfg.padding;

	            // Finalize
	            if (this._xformMode == this._ENC_XFORM_MODE) {
	                // Pad data
	                padding.pad(this._data, this.blockSize);

	                // Process final blocks
	                finalProcessedBlocks = this._process(!!'flush');
	            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
	                // Process final blocks
	                finalProcessedBlocks = this._process(!!'flush');

	                // Unpad data
	                padding.unpad(finalProcessedBlocks);
	            }

	            return finalProcessedBlocks;
	        },

	        blockSize: 128/32
	    });

	    /**
	     * A collection of cipher parameters.
	     *
	     * @property {WordArray} ciphertext The raw ciphertext.
	     * @property {WordArray} key The key to this ciphertext.
	     * @property {WordArray} iv The IV used in the ciphering operation.
	     * @property {WordArray} salt The salt used with a key derivation function.
	     * @property {Cipher} algorithm The cipher algorithm.
	     * @property {Mode} mode The block mode used in the ciphering operation.
	     * @property {Padding} padding The padding scheme used in the ciphering operation.
	     * @property {number} blockSize The block size of the cipher.
	     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
	     */
	    var CipherParams = C_lib.CipherParams = Base.extend({
	        /**
	         * Initializes a newly created cipher params object.
	         *
	         * @param {Object} cipherParams An object with any of the possible cipher parameters.
	         *
	         * @example
	         *
	         *     var cipherParams = CryptoJS.lib.CipherParams.create({
	         *         ciphertext: ciphertextWordArray,
	         *         key: keyWordArray,
	         *         iv: ivWordArray,
	         *         salt: saltWordArray,
	         *         algorithm: CryptoJS.algo.AES,
	         *         mode: CryptoJS.mode.CBC,
	         *         padding: CryptoJS.pad.PKCS7,
	         *         blockSize: 4,
	         *         formatter: CryptoJS.format.OpenSSL
	         *     });
	         */
	        init: function (cipherParams) {
	            this.mixIn(cipherParams);
	        },

	        /**
	         * Converts this cipher params object to a string.
	         *
	         * @param {Format} formatter (Optional) The formatting strategy to use.
	         *
	         * @return {string} The stringified cipher params.
	         *
	         * @throws Error If neither the formatter nor the default formatter is set.
	         *
	         * @example
	         *
	         *     var string = cipherParams + '';
	         *     var string = cipherParams.toString();
	         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
	         */
	        toString: function (formatter) {
	            return (formatter || this.formatter).stringify(this);
	        }
	    });

	    /**
	     * Format namespace.
	     */
	    var C_format = C.format = {};

	    /**
	     * OpenSSL formatting strategy.
	     */
	    var OpenSSLFormatter = C_format.OpenSSL = {
	        /**
	         * Converts a cipher params object to an OpenSSL-compatible string.
	         *
	         * @param {CipherParams} cipherParams The cipher params object.
	         *
	         * @return {string} The OpenSSL-compatible string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
	         */
	        stringify: function (cipherParams) {
	            var wordArray;

	            // Shortcuts
	            var ciphertext = cipherParams.ciphertext;
	            var salt = cipherParams.salt;

	            // Format
	            if (salt) {
	                wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
	            } else {
	                wordArray = ciphertext;
	            }

	            return wordArray.toString(Base64);
	        },

	        /**
	         * Converts an OpenSSL-compatible string to a cipher params object.
	         *
	         * @param {string} openSSLStr The OpenSSL-compatible string.
	         *
	         * @return {CipherParams} The cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
	         */
	        parse: function (openSSLStr) {
	            var salt;

	            // Parse base64
	            var ciphertext = Base64.parse(openSSLStr);

	            // Shortcut
	            var ciphertextWords = ciphertext.words;

	            // Test for salt
	            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
	                // Extract salt
	                salt = WordArray.create(ciphertextWords.slice(2, 4));

	                // Remove salt from ciphertext
	                ciphertextWords.splice(0, 4);
	                ciphertext.sigBytes -= 16;
	            }

	            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
	        }
	    };

	    /**
	     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
	     */
	    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
	         */
	        cfg: Base.extend({
	            format: OpenSSLFormatter
	        }),

	        /**
	         * Encrypts a message.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {WordArray|string} message The message to encrypt.
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {CipherParams} A cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	         */
	        encrypt: function (cipher, message, key, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Encrypt
	            var encryptor = cipher.createEncryptor(key, cfg);
	            var ciphertext = encryptor.finalize(message);

	            // Shortcut
	            var cipherCfg = encryptor.cfg;

	            // Create and return serializable cipher params
	            return CipherParams.create({
	                ciphertext: ciphertext,
	                key: key,
	                iv: cipherCfg.iv,
	                algorithm: cipher,
	                mode: cipherCfg.mode,
	                padding: cipherCfg.padding,
	                blockSize: cipher.blockSize,
	                formatter: cfg.format
	            });
	        },

	        /**
	         * Decrypts serialized ciphertext.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {WordArray} The plaintext.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	         */
	        decrypt: function (cipher, ciphertext, key, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Convert string to CipherParams
	            ciphertext = this._parse(ciphertext, cfg.format);

	            // Decrypt
	            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

	            return plaintext;
	        },

	        /**
	         * Converts serialized ciphertext to CipherParams,
	         * else assumed CipherParams already and returns ciphertext unchanged.
	         *
	         * @param {CipherParams|string} ciphertext The ciphertext.
	         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
	         *
	         * @return {CipherParams} The unserialized ciphertext.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
	         */
	        _parse: function (ciphertext, format) {
	            if (typeof ciphertext == 'string') {
	                return format.parse(ciphertext, this);
	            } else {
	                return ciphertext;
	            }
	        }
	    });

	    /**
	     * Key derivation function namespace.
	     */
	    var C_kdf = C.kdf = {};

	    /**
	     * OpenSSL key derivation function.
	     */
	    var OpenSSLKdf = C_kdf.OpenSSL = {
	        /**
	         * Derives a key and IV from a password.
	         *
	         * @param {string} password The password to derive from.
	         * @param {number} keySize The size in words of the key to generate.
	         * @param {number} ivSize The size in words of the IV to generate.
	         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
	         *
	         * @return {CipherParams} A cipher params object with the key, IV, and salt.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
	         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
	         */
	        execute: function (password, keySize, ivSize, salt, hasher) {
	            // Generate random salt
	            if (!salt) {
	                salt = WordArray.random(64/8);
	            }

	            // Derive key and IV
	            if (!hasher) {
	                var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
	            } else {
	                var key = EvpKDF.create({ keySize: keySize + ivSize, hasher: hasher }).compute(password, salt);
	            }


	            // Separate key and IV
	            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
	            key.sigBytes = keySize * 4;

	            // Return params
	            return CipherParams.create({ key: key, iv: iv, salt: salt });
	        }
	    };

	    /**
	     * A serializable cipher wrapper that derives the key from a password,
	     * and returns ciphertext as a serializable cipher params object.
	     */
	    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
	         */
	        cfg: SerializableCipher.cfg.extend({
	            kdf: OpenSSLKdf
	        }),

	        /**
	         * Encrypts a message using a password.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {WordArray|string} message The message to encrypt.
	         * @param {string} password The password.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {CipherParams} A cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
	         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
	         */
	        encrypt: function (cipher, message, password, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Derive key and other params
	            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);

	            // Add IV to config
	            cfg.iv = derivedParams.iv;

	            // Encrypt
	            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

	            // Mix in derived params
	            ciphertext.mixIn(derivedParams);

	            return ciphertext;
	        },

	        /**
	         * Decrypts serialized ciphertext using a password.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
	         * @param {string} password The password.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {WordArray} The plaintext.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
	         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
	         */
	        decrypt: function (cipher, ciphertext, password, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Convert string to CipherParams
	            ciphertext = this._parse(ciphertext, cfg.format);

	            // Derive key and other params
	            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);

	            // Add IV to config
	            cfg.iv = derivedParams.iv;

	            // Decrypt
	            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

	            return plaintext;
	        }
	    });
	}());


	/**
	 * Cipher Feedback block mode.
	 */
	CryptoJS.mode.CFB = (function () {
	    var CFB = CryptoJS.lib.BlockCipherMode.extend();

	    CFB.Encryptor = CFB.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher;
	            var blockSize = cipher.blockSize;

	            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

	            // Remember this block to use with next block
	            this._prevBlock = words.slice(offset, offset + blockSize);
	        }
	    });

	    CFB.Decryptor = CFB.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher;
	            var blockSize = cipher.blockSize;

	            // Remember this block to use with next block
	            var thisBlock = words.slice(offset, offset + blockSize);

	            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

	            // This block becomes the previous block
	            this._prevBlock = thisBlock;
	        }
	    });

	    function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
	        var keystream;

	        // Shortcut
	        var iv = this._iv;

	        // Generate keystream
	        if (iv) {
	            keystream = iv.slice(0);

	            // Remove IV for subsequent blocks
	            this._iv = undefined;
	        } else {
	            keystream = this._prevBlock;
	        }
	        cipher.encryptBlock(keystream, 0);

	        // Encrypt
	        for (var i = 0; i < blockSize; i++) {
	            words[offset + i] ^= keystream[i];
	        }
	    }

	    return CFB;
	}());


	/**
	 * Counter block mode.
	 */
	CryptoJS.mode.CTR = (function () {
	    var CTR = CryptoJS.lib.BlockCipherMode.extend();

	    var Encryptor = CTR.Encryptor = CTR.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher
	            var blockSize = cipher.blockSize;
	            var iv = this._iv;
	            var counter = this._counter;

	            // Generate keystream
	            if (iv) {
	                counter = this._counter = iv.slice(0);

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            }
	            var keystream = counter.slice(0);
	            cipher.encryptBlock(keystream, 0);

	            // Increment counter
	            counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0

	            // Encrypt
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= keystream[i];
	            }
	        }
	    });

	    CTR.Decryptor = Encryptor;

	    return CTR;
	}());


	/** @preserve
	 * Counter block mode compatible with  Dr Brian Gladman fileenc.c
	 * derived from CryptoJS.mode.CTR
	 * Jan Hruby jhruby.web@gmail.com
	 */
	CryptoJS.mode.CTRGladman = (function () {
	    var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

		function incWord(word)
		{
			if (((word >> 24) & 0xff) === 0xff) { //overflow
			var b1 = (word >> 16)&0xff;
			var b2 = (word >> 8)&0xff;
			var b3 = word & 0xff;

			if (b1 === 0xff) // overflow b1
			{
			b1 = 0;
			if (b2 === 0xff)
			{
				b2 = 0;
				if (b3 === 0xff)
				{
					b3 = 0;
				}
				else
				{
					++b3;
				}
			}
			else
			{
				++b2;
			}
			}
			else
			{
			++b1;
			}

			word = 0;
			word += (b1 << 16);
			word += (b2 << 8);
			word += b3;
			}
			else
			{
			word += (0x01 << 24);
			}
			return word;
		}

		function incCounter(counter)
		{
			if ((counter[0] = incWord(counter[0])) === 0)
			{
				// encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
				counter[1] = incWord(counter[1]);
			}
			return counter;
		}

	    var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher
	            var blockSize = cipher.blockSize;
	            var iv = this._iv;
	            var counter = this._counter;

	            // Generate keystream
	            if (iv) {
	                counter = this._counter = iv.slice(0);

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            }

				incCounter(counter);

				var keystream = counter.slice(0);
	            cipher.encryptBlock(keystream, 0);

	            // Encrypt
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= keystream[i];
	            }
	        }
	    });

	    CTRGladman.Decryptor = Encryptor;

	    return CTRGladman;
	}());




	/**
	 * Output Feedback block mode.
	 */
	CryptoJS.mode.OFB = (function () {
	    var OFB = CryptoJS.lib.BlockCipherMode.extend();

	    var Encryptor = OFB.Encryptor = OFB.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher
	            var blockSize = cipher.blockSize;
	            var iv = this._iv;
	            var keystream = this._keystream;

	            // Generate keystream
	            if (iv) {
	                keystream = this._keystream = iv.slice(0);

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            }
	            cipher.encryptBlock(keystream, 0);

	            // Encrypt
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= keystream[i];
	            }
	        }
	    });

	    OFB.Decryptor = Encryptor;

	    return OFB;
	}());


	/**
	 * Electronic Codebook block mode.
	 */
	CryptoJS.mode.ECB = (function () {
	    var ECB = CryptoJS.lib.BlockCipherMode.extend();

	    ECB.Encryptor = ECB.extend({
	        processBlock: function (words, offset) {
	            this._cipher.encryptBlock(words, offset);
	        }
	    });

	    ECB.Decryptor = ECB.extend({
	        processBlock: function (words, offset) {
	            this._cipher.decryptBlock(words, offset);
	        }
	    });

	    return ECB;
	}());


	/**
	 * ANSI X.923 padding strategy.
	 */
	CryptoJS.pad.AnsiX923 = {
	    pad: function (data, blockSize) {
	        // Shortcuts
	        var dataSigBytes = data.sigBytes;
	        var blockSizeBytes = blockSize * 4;

	        // Count padding bytes
	        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;

	        // Compute last byte position
	        var lastBytePos = dataSigBytes + nPaddingBytes - 1;

	        // Pad
	        data.clamp();
	        data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
	        data.sigBytes += nPaddingBytes;
	    },

	    unpad: function (data) {
	        // Get number of padding bytes from last byte
	        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

	        // Remove padding
	        data.sigBytes -= nPaddingBytes;
	    }
	};


	/**
	 * ISO 10126 padding strategy.
	 */
	CryptoJS.pad.Iso10126 = {
	    pad: function (data, blockSize) {
	        // Shortcut
	        var blockSizeBytes = blockSize * 4;

	        // Count padding bytes
	        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

	        // Pad
	        data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).
	             concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
	    },

	    unpad: function (data) {
	        // Get number of padding bytes from last byte
	        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

	        // Remove padding
	        data.sigBytes -= nPaddingBytes;
	    }
	};


	/**
	 * ISO/IEC 9797-1 Padding Method 2.
	 */
	CryptoJS.pad.Iso97971 = {
	    pad: function (data, blockSize) {
	        // Add 0x80 byte
	        data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));

	        // Zero pad the rest
	        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
	    },

	    unpad: function (data) {
	        // Remove zero padding
	        CryptoJS.pad.ZeroPadding.unpad(data);

	        // Remove one more byte -- the 0x80 byte
	        data.sigBytes--;
	    }
	};


	/**
	 * Zero padding strategy.
	 */
	CryptoJS.pad.ZeroPadding = {
	    pad: function (data, blockSize) {
	        // Shortcut
	        var blockSizeBytes = blockSize * 4;

	        // Pad
	        data.clamp();
	        data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
	    },

	    unpad: function (data) {
	        // Shortcut
	        var dataWords = data.words;

	        // Unpad
	        var i = data.sigBytes - 1;
	        for (var i = data.sigBytes - 1; i >= 0; i--) {
	            if (((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
	                data.sigBytes = i + 1;
	                break;
	            }
	        }
	    }
	};


	/**
	 * A noop padding strategy.
	 */
	CryptoJS.pad.NoPadding = {
	    pad: function () {
	    },

	    unpad: function () {
	    }
	};


	(function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var CipherParams = C_lib.CipherParams;
	    var C_enc = C.enc;
	    var Hex = C_enc.Hex;
	    var C_format = C.format;

	    var HexFormatter = C_format.Hex = {
	        /**
	         * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
	         *
	         * @param {CipherParams} cipherParams The cipher params object.
	         *
	         * @return {string} The hexadecimally encoded string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
	         */
	        stringify: function (cipherParams) {
	            return cipherParams.ciphertext.toString(Hex);
	        },

	        /**
	         * Converts a hexadecimally encoded ciphertext string to a cipher params object.
	         *
	         * @param {string} input The hexadecimally encoded string.
	         *
	         * @return {CipherParams} The cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
	         */
	        parse: function (input) {
	            var ciphertext = Hex.parse(input);
	            return CipherParams.create({ ciphertext: ciphertext });
	        }
	    };
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var BlockCipher = C_lib.BlockCipher;
	    var C_algo = C.algo;

	    // Lookup tables
	    var SBOX = [];
	    var INV_SBOX = [];
	    var SUB_MIX_0 = [];
	    var SUB_MIX_1 = [];
	    var SUB_MIX_2 = [];
	    var SUB_MIX_3 = [];
	    var INV_SUB_MIX_0 = [];
	    var INV_SUB_MIX_1 = [];
	    var INV_SUB_MIX_2 = [];
	    var INV_SUB_MIX_3 = [];

	    // Compute lookup tables
	    (function () {
	        // Compute double table
	        var d = [];
	        for (var i = 0; i < 256; i++) {
	            if (i < 128) {
	                d[i] = i << 1;
	            } else {
	                d[i] = (i << 1) ^ 0x11b;
	            }
	        }

	        // Walk GF(2^8)
	        var x = 0;
	        var xi = 0;
	        for (var i = 0; i < 256; i++) {
	            // Compute sbox
	            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
	            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
	            SBOX[x] = sx;
	            INV_SBOX[sx] = x;

	            // Compute multiplication
	            var x2 = d[x];
	            var x4 = d[x2];
	            var x8 = d[x4];

	            // Compute sub bytes, mix columns tables
	            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
	            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
	            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
	            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
	            SUB_MIX_3[x] = t;

	            // Compute inv sub bytes, inv mix columns tables
	            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
	            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
	            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
	            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
	            INV_SUB_MIX_3[sx] = t;

	            // Compute next counter
	            if (!x) {
	                x = xi = 1;
	            } else {
	                x = x2 ^ d[d[d[x8 ^ x2]]];
	                xi ^= d[d[xi]];
	            }
	        }
	    }());

	    // Precomputed Rcon lookup
	    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

	    /**
	     * AES block cipher algorithm.
	     */
	    var AES = C_algo.AES = BlockCipher.extend({
	        _doReset: function () {
	            var t;

	            // Skip reset of nRounds has been set before and key did not change
	            if (this._nRounds && this._keyPriorReset === this._key) {
	                return;
	            }

	            // Shortcuts
	            var key = this._keyPriorReset = this._key;
	            var keyWords = key.words;
	            var keySize = key.sigBytes / 4;

	            // Compute number of rounds
	            var nRounds = this._nRounds = keySize + 6;

	            // Compute number of key schedule rows
	            var ksRows = (nRounds + 1) * 4;

	            // Compute key schedule
	            var keySchedule = this._keySchedule = [];
	            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
	                if (ksRow < keySize) {
	                    keySchedule[ksRow] = keyWords[ksRow];
	                } else {
	                    t = keySchedule[ksRow - 1];

	                    if (!(ksRow % keySize)) {
	                        // Rot word
	                        t = (t << 8) | (t >>> 24);

	                        // Sub word
	                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

	                        // Mix Rcon
	                        t ^= RCON[(ksRow / keySize) | 0] << 24;
	                    } else if (keySize > 6 && ksRow % keySize == 4) {
	                        // Sub word
	                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
	                    }

	                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
	                }
	            }

	            // Compute inv key schedule
	            var invKeySchedule = this._invKeySchedule = [];
	            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
	                var ksRow = ksRows - invKsRow;

	                if (invKsRow % 4) {
	                    var t = keySchedule[ksRow];
	                } else {
	                    var t = keySchedule[ksRow - 4];
	                }

	                if (invKsRow < 4 || ksRow <= 4) {
	                    invKeySchedule[invKsRow] = t;
	                } else {
	                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
	                                               INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
	                }
	            }
	        },

	        encryptBlock: function (M, offset) {
	            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
	        },

	        decryptBlock: function (M, offset) {
	            // Swap 2nd and 4th rows
	            var t = M[offset + 1];
	            M[offset + 1] = M[offset + 3];
	            M[offset + 3] = t;

	            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

	            // Inv swap 2nd and 4th rows
	            var t = M[offset + 1];
	            M[offset + 1] = M[offset + 3];
	            M[offset + 3] = t;
	        },

	        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
	            // Shortcut
	            var nRounds = this._nRounds;

	            // Get input, add round key
	            var s0 = M[offset]     ^ keySchedule[0];
	            var s1 = M[offset + 1] ^ keySchedule[1];
	            var s2 = M[offset + 2] ^ keySchedule[2];
	            var s3 = M[offset + 3] ^ keySchedule[3];

	            // Key schedule row counter
	            var ksRow = 4;

	            // Rounds
	            for (var round = 1; round < nRounds; round++) {
	                // Shift rows, sub bytes, mix columns, add round key
	                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
	                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
	                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
	                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

	                // Update state
	                s0 = t0;
	                s1 = t1;
	                s2 = t2;
	                s3 = t3;
	            }

	            // Shift rows, sub bytes, add round key
	            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
	            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
	            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
	            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

	            // Set output
	            M[offset]     = t0;
	            M[offset + 1] = t1;
	            M[offset + 2] = t2;
	            M[offset + 3] = t3;
	        },

	        keySize: 256/32
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
	     */
	    C.AES = BlockCipher._createHelper(AES);
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var BlockCipher = C_lib.BlockCipher;
	    var C_algo = C.algo;

	    // Permuted Choice 1 constants
	    var PC1 = [
	        57, 49, 41, 33, 25, 17, 9,  1,
	        58, 50, 42, 34, 26, 18, 10, 2,
	        59, 51, 43, 35, 27, 19, 11, 3,
	        60, 52, 44, 36, 63, 55, 47, 39,
	        31, 23, 15, 7,  62, 54, 46, 38,
	        30, 22, 14, 6,  61, 53, 45, 37,
	        29, 21, 13, 5,  28, 20, 12, 4
	    ];

	    // Permuted Choice 2 constants
	    var PC2 = [
	        14, 17, 11, 24, 1,  5,
	        3,  28, 15, 6,  21, 10,
	        23, 19, 12, 4,  26, 8,
	        16, 7,  27, 20, 13, 2,
	        41, 52, 31, 37, 47, 55,
	        30, 40, 51, 45, 33, 48,
	        44, 49, 39, 56, 34, 53,
	        46, 42, 50, 36, 29, 32
	    ];

	    // Cumulative bit shift constants
	    var BIT_SHIFTS = [1,  2,  4,  6,  8,  10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

	    // SBOXes and round permutation constants
	    var SBOX_P = [
	        {
	            0x0: 0x808200,
	            0x10000000: 0x8000,
	            0x20000000: 0x808002,
	            0x30000000: 0x2,
	            0x40000000: 0x200,
	            0x50000000: 0x808202,
	            0x60000000: 0x800202,
	            0x70000000: 0x800000,
	            0x80000000: 0x202,
	            0x90000000: 0x800200,
	            0xa0000000: 0x8200,
	            0xb0000000: 0x808000,
	            0xc0000000: 0x8002,
	            0xd0000000: 0x800002,
	            0xe0000000: 0x0,
	            0xf0000000: 0x8202,
	            0x8000000: 0x0,
	            0x18000000: 0x808202,
	            0x28000000: 0x8202,
	            0x38000000: 0x8000,
	            0x48000000: 0x808200,
	            0x58000000: 0x200,
	            0x68000000: 0x808002,
	            0x78000000: 0x2,
	            0x88000000: 0x800200,
	            0x98000000: 0x8200,
	            0xa8000000: 0x808000,
	            0xb8000000: 0x800202,
	            0xc8000000: 0x800002,
	            0xd8000000: 0x8002,
	            0xe8000000: 0x202,
	            0xf8000000: 0x800000,
	            0x1: 0x8000,
	            0x10000001: 0x2,
	            0x20000001: 0x808200,
	            0x30000001: 0x800000,
	            0x40000001: 0x808002,
	            0x50000001: 0x8200,
	            0x60000001: 0x200,
	            0x70000001: 0x800202,
	            0x80000001: 0x808202,
	            0x90000001: 0x808000,
	            0xa0000001: 0x800002,
	            0xb0000001: 0x8202,
	            0xc0000001: 0x202,
	            0xd0000001: 0x800200,
	            0xe0000001: 0x8002,
	            0xf0000001: 0x0,
	            0x8000001: 0x808202,
	            0x18000001: 0x808000,
	            0x28000001: 0x800000,
	            0x38000001: 0x200,
	            0x48000001: 0x8000,
	            0x58000001: 0x800002,
	            0x68000001: 0x2,
	            0x78000001: 0x8202,
	            0x88000001: 0x8002,
	            0x98000001: 0x800202,
	            0xa8000001: 0x202,
	            0xb8000001: 0x808200,
	            0xc8000001: 0x800200,
	            0xd8000001: 0x0,
	            0xe8000001: 0x8200,
	            0xf8000001: 0x808002
	        },
	        {
	            0x0: 0x40084010,
	            0x1000000: 0x4000,
	            0x2000000: 0x80000,
	            0x3000000: 0x40080010,
	            0x4000000: 0x40000010,
	            0x5000000: 0x40084000,
	            0x6000000: 0x40004000,
	            0x7000000: 0x10,
	            0x8000000: 0x84000,
	            0x9000000: 0x40004010,
	            0xa000000: 0x40000000,
	            0xb000000: 0x84010,
	            0xc000000: 0x80010,
	            0xd000000: 0x0,
	            0xe000000: 0x4010,
	            0xf000000: 0x40080000,
	            0x800000: 0x40004000,
	            0x1800000: 0x84010,
	            0x2800000: 0x10,
	            0x3800000: 0x40004010,
	            0x4800000: 0x40084010,
	            0x5800000: 0x40000000,
	            0x6800000: 0x80000,
	            0x7800000: 0x40080010,
	            0x8800000: 0x80010,
	            0x9800000: 0x0,
	            0xa800000: 0x4000,
	            0xb800000: 0x40080000,
	            0xc800000: 0x40000010,
	            0xd800000: 0x84000,
	            0xe800000: 0x40084000,
	            0xf800000: 0x4010,
	            0x10000000: 0x0,
	            0x11000000: 0x40080010,
	            0x12000000: 0x40004010,
	            0x13000000: 0x40084000,
	            0x14000000: 0x40080000,
	            0x15000000: 0x10,
	            0x16000000: 0x84010,
	            0x17000000: 0x4000,
	            0x18000000: 0x4010,
	            0x19000000: 0x80000,
	            0x1a000000: 0x80010,
	            0x1b000000: 0x40000010,
	            0x1c000000: 0x84000,
	            0x1d000000: 0x40004000,
	            0x1e000000: 0x40000000,
	            0x1f000000: 0x40084010,
	            0x10800000: 0x84010,
	            0x11800000: 0x80000,
	            0x12800000: 0x40080000,
	            0x13800000: 0x4000,
	            0x14800000: 0x40004000,
	            0x15800000: 0x40084010,
	            0x16800000: 0x10,
	            0x17800000: 0x40000000,
	            0x18800000: 0x40084000,
	            0x19800000: 0x40000010,
	            0x1a800000: 0x40004010,
	            0x1b800000: 0x80010,
	            0x1c800000: 0x0,
	            0x1d800000: 0x4010,
	            0x1e800000: 0x40080010,
	            0x1f800000: 0x84000
	        },
	        {
	            0x0: 0x104,
	            0x100000: 0x0,
	            0x200000: 0x4000100,
	            0x300000: 0x10104,
	            0x400000: 0x10004,
	            0x500000: 0x4000004,
	            0x600000: 0x4010104,
	            0x700000: 0x4010000,
	            0x800000: 0x4000000,
	            0x900000: 0x4010100,
	            0xa00000: 0x10100,
	            0xb00000: 0x4010004,
	            0xc00000: 0x4000104,
	            0xd00000: 0x10000,
	            0xe00000: 0x4,
	            0xf00000: 0x100,
	            0x80000: 0x4010100,
	            0x180000: 0x4010004,
	            0x280000: 0x0,
	            0x380000: 0x4000100,
	            0x480000: 0x4000004,
	            0x580000: 0x10000,
	            0x680000: 0x10004,
	            0x780000: 0x104,
	            0x880000: 0x4,
	            0x980000: 0x100,
	            0xa80000: 0x4010000,
	            0xb80000: 0x10104,
	            0xc80000: 0x10100,
	            0xd80000: 0x4000104,
	            0xe80000: 0x4010104,
	            0xf80000: 0x4000000,
	            0x1000000: 0x4010100,
	            0x1100000: 0x10004,
	            0x1200000: 0x10000,
	            0x1300000: 0x4000100,
	            0x1400000: 0x100,
	            0x1500000: 0x4010104,
	            0x1600000: 0x4000004,
	            0x1700000: 0x0,
	            0x1800000: 0x4000104,
	            0x1900000: 0x4000000,
	            0x1a00000: 0x4,
	            0x1b00000: 0x10100,
	            0x1c00000: 0x4010000,
	            0x1d00000: 0x104,
	            0x1e00000: 0x10104,
	            0x1f00000: 0x4010004,
	            0x1080000: 0x4000000,
	            0x1180000: 0x104,
	            0x1280000: 0x4010100,
	            0x1380000: 0x0,
	            0x1480000: 0x10004,
	            0x1580000: 0x4000100,
	            0x1680000: 0x100,
	            0x1780000: 0x4010004,
	            0x1880000: 0x10000,
	            0x1980000: 0x4010104,
	            0x1a80000: 0x10104,
	            0x1b80000: 0x4000004,
	            0x1c80000: 0x4000104,
	            0x1d80000: 0x4010000,
	            0x1e80000: 0x4,
	            0x1f80000: 0x10100
	        },
	        {
	            0x0: 0x80401000,
	            0x10000: 0x80001040,
	            0x20000: 0x401040,
	            0x30000: 0x80400000,
	            0x40000: 0x0,
	            0x50000: 0x401000,
	            0x60000: 0x80000040,
	            0x70000: 0x400040,
	            0x80000: 0x80000000,
	            0x90000: 0x400000,
	            0xa0000: 0x40,
	            0xb0000: 0x80001000,
	            0xc0000: 0x80400040,
	            0xd0000: 0x1040,
	            0xe0000: 0x1000,
	            0xf0000: 0x80401040,
	            0x8000: 0x80001040,
	            0x18000: 0x40,
	            0x28000: 0x80400040,
	            0x38000: 0x80001000,
	            0x48000: 0x401000,
	            0x58000: 0x80401040,
	            0x68000: 0x0,
	            0x78000: 0x80400000,
	            0x88000: 0x1000,
	            0x98000: 0x80401000,
	            0xa8000: 0x400000,
	            0xb8000: 0x1040,
	            0xc8000: 0x80000000,
	            0xd8000: 0x400040,
	            0xe8000: 0x401040,
	            0xf8000: 0x80000040,
	            0x100000: 0x400040,
	            0x110000: 0x401000,
	            0x120000: 0x80000040,
	            0x130000: 0x0,
	            0x140000: 0x1040,
	            0x150000: 0x80400040,
	            0x160000: 0x80401000,
	            0x170000: 0x80001040,
	            0x180000: 0x80401040,
	            0x190000: 0x80000000,
	            0x1a0000: 0x80400000,
	            0x1b0000: 0x401040,
	            0x1c0000: 0x80001000,
	            0x1d0000: 0x400000,
	            0x1e0000: 0x40,
	            0x1f0000: 0x1000,
	            0x108000: 0x80400000,
	            0x118000: 0x80401040,
	            0x128000: 0x0,
	            0x138000: 0x401000,
	            0x148000: 0x400040,
	            0x158000: 0x80000000,
	            0x168000: 0x80001040,
	            0x178000: 0x40,
	            0x188000: 0x80000040,
	            0x198000: 0x1000,
	            0x1a8000: 0x80001000,
	            0x1b8000: 0x80400040,
	            0x1c8000: 0x1040,
	            0x1d8000: 0x80401000,
	            0x1e8000: 0x400000,
	            0x1f8000: 0x401040
	        },
	        {
	            0x0: 0x80,
	            0x1000: 0x1040000,
	            0x2000: 0x40000,
	            0x3000: 0x20000000,
	            0x4000: 0x20040080,
	            0x5000: 0x1000080,
	            0x6000: 0x21000080,
	            0x7000: 0x40080,
	            0x8000: 0x1000000,
	            0x9000: 0x20040000,
	            0xa000: 0x20000080,
	            0xb000: 0x21040080,
	            0xc000: 0x21040000,
	            0xd000: 0x0,
	            0xe000: 0x1040080,
	            0xf000: 0x21000000,
	            0x800: 0x1040080,
	            0x1800: 0x21000080,
	            0x2800: 0x80,
	            0x3800: 0x1040000,
	            0x4800: 0x40000,
	            0x5800: 0x20040080,
	            0x6800: 0x21040000,
	            0x7800: 0x20000000,
	            0x8800: 0x20040000,
	            0x9800: 0x0,
	            0xa800: 0x21040080,
	            0xb800: 0x1000080,
	            0xc800: 0x20000080,
	            0xd800: 0x21000000,
	            0xe800: 0x1000000,
	            0xf800: 0x40080,
	            0x10000: 0x40000,
	            0x11000: 0x80,
	            0x12000: 0x20000000,
	            0x13000: 0x21000080,
	            0x14000: 0x1000080,
	            0x15000: 0x21040000,
	            0x16000: 0x20040080,
	            0x17000: 0x1000000,
	            0x18000: 0x21040080,
	            0x19000: 0x21000000,
	            0x1a000: 0x1040000,
	            0x1b000: 0x20040000,
	            0x1c000: 0x40080,
	            0x1d000: 0x20000080,
	            0x1e000: 0x0,
	            0x1f000: 0x1040080,
	            0x10800: 0x21000080,
	            0x11800: 0x1000000,
	            0x12800: 0x1040000,
	            0x13800: 0x20040080,
	            0x14800: 0x20000000,
	            0x15800: 0x1040080,
	            0x16800: 0x80,
	            0x17800: 0x21040000,
	            0x18800: 0x40080,
	            0x19800: 0x21040080,
	            0x1a800: 0x0,
	            0x1b800: 0x21000000,
	            0x1c800: 0x1000080,
	            0x1d800: 0x40000,
	            0x1e800: 0x20040000,
	            0x1f800: 0x20000080
	        },
	        {
	            0x0: 0x10000008,
	            0x100: 0x2000,
	            0x200: 0x10200000,
	            0x300: 0x10202008,
	            0x400: 0x10002000,
	            0x500: 0x200000,
	            0x600: 0x200008,
	            0x700: 0x10000000,
	            0x800: 0x0,
	            0x900: 0x10002008,
	            0xa00: 0x202000,
	            0xb00: 0x8,
	            0xc00: 0x10200008,
	            0xd00: 0x202008,
	            0xe00: 0x2008,
	            0xf00: 0x10202000,
	            0x80: 0x10200000,
	            0x180: 0x10202008,
	            0x280: 0x8,
	            0x380: 0x200000,
	            0x480: 0x202008,
	            0x580: 0x10000008,
	            0x680: 0x10002000,
	            0x780: 0x2008,
	            0x880: 0x200008,
	            0x980: 0x2000,
	            0xa80: 0x10002008,
	            0xb80: 0x10200008,
	            0xc80: 0x0,
	            0xd80: 0x10202000,
	            0xe80: 0x202000,
	            0xf80: 0x10000000,
	            0x1000: 0x10002000,
	            0x1100: 0x10200008,
	            0x1200: 0x10202008,
	            0x1300: 0x2008,
	            0x1400: 0x200000,
	            0x1500: 0x10000000,
	            0x1600: 0x10000008,
	            0x1700: 0x202000,
	            0x1800: 0x202008,
	            0x1900: 0x0,
	            0x1a00: 0x8,
	            0x1b00: 0x10200000,
	            0x1c00: 0x2000,
	            0x1d00: 0x10002008,
	            0x1e00: 0x10202000,
	            0x1f00: 0x200008,
	            0x1080: 0x8,
	            0x1180: 0x202000,
	            0x1280: 0x200000,
	            0x1380: 0x10000008,
	            0x1480: 0x10002000,
	            0x1580: 0x2008,
	            0x1680: 0x10202008,
	            0x1780: 0x10200000,
	            0x1880: 0x10202000,
	            0x1980: 0x10200008,
	            0x1a80: 0x2000,
	            0x1b80: 0x202008,
	            0x1c80: 0x200008,
	            0x1d80: 0x0,
	            0x1e80: 0x10000000,
	            0x1f80: 0x10002008
	        },
	        {
	            0x0: 0x100000,
	            0x10: 0x2000401,
	            0x20: 0x400,
	            0x30: 0x100401,
	            0x40: 0x2100401,
	            0x50: 0x0,
	            0x60: 0x1,
	            0x70: 0x2100001,
	            0x80: 0x2000400,
	            0x90: 0x100001,
	            0xa0: 0x2000001,
	            0xb0: 0x2100400,
	            0xc0: 0x2100000,
	            0xd0: 0x401,
	            0xe0: 0x100400,
	            0xf0: 0x2000000,
	            0x8: 0x2100001,
	            0x18: 0x0,
	            0x28: 0x2000401,
	            0x38: 0x2100400,
	            0x48: 0x100000,
	            0x58: 0x2000001,
	            0x68: 0x2000000,
	            0x78: 0x401,
	            0x88: 0x100401,
	            0x98: 0x2000400,
	            0xa8: 0x2100000,
	            0xb8: 0x100001,
	            0xc8: 0x400,
	            0xd8: 0x2100401,
	            0xe8: 0x1,
	            0xf8: 0x100400,
	            0x100: 0x2000000,
	            0x110: 0x100000,
	            0x120: 0x2000401,
	            0x130: 0x2100001,
	            0x140: 0x100001,
	            0x150: 0x2000400,
	            0x160: 0x2100400,
	            0x170: 0x100401,
	            0x180: 0x401,
	            0x190: 0x2100401,
	            0x1a0: 0x100400,
	            0x1b0: 0x1,
	            0x1c0: 0x0,
	            0x1d0: 0x2100000,
	            0x1e0: 0x2000001,
	            0x1f0: 0x400,
	            0x108: 0x100400,
	            0x118: 0x2000401,
	            0x128: 0x2100001,
	            0x138: 0x1,
	            0x148: 0x2000000,
	            0x158: 0x100000,
	            0x168: 0x401,
	            0x178: 0x2100400,
	            0x188: 0x2000001,
	            0x198: 0x2100000,
	            0x1a8: 0x0,
	            0x1b8: 0x2100401,
	            0x1c8: 0x100401,
	            0x1d8: 0x400,
	            0x1e8: 0x2000400,
	            0x1f8: 0x100001
	        },
	        {
	            0x0: 0x8000820,
	            0x1: 0x20000,
	            0x2: 0x8000000,
	            0x3: 0x20,
	            0x4: 0x20020,
	            0x5: 0x8020820,
	            0x6: 0x8020800,
	            0x7: 0x800,
	            0x8: 0x8020000,
	            0x9: 0x8000800,
	            0xa: 0x20800,
	            0xb: 0x8020020,
	            0xc: 0x820,
	            0xd: 0x0,
	            0xe: 0x8000020,
	            0xf: 0x20820,
	            0x80000000: 0x800,
	            0x80000001: 0x8020820,
	            0x80000002: 0x8000820,
	            0x80000003: 0x8000000,
	            0x80000004: 0x8020000,
	            0x80000005: 0x20800,
	            0x80000006: 0x20820,
	            0x80000007: 0x20,
	            0x80000008: 0x8000020,
	            0x80000009: 0x820,
	            0x8000000a: 0x20020,
	            0x8000000b: 0x8020800,
	            0x8000000c: 0x0,
	            0x8000000d: 0x8020020,
	            0x8000000e: 0x8000800,
	            0x8000000f: 0x20000,
	            0x10: 0x20820,
	            0x11: 0x8020800,
	            0x12: 0x20,
	            0x13: 0x800,
	            0x14: 0x8000800,
	            0x15: 0x8000020,
	            0x16: 0x8020020,
	            0x17: 0x20000,
	            0x18: 0x0,
	            0x19: 0x20020,
	            0x1a: 0x8020000,
	            0x1b: 0x8000820,
	            0x1c: 0x8020820,
	            0x1d: 0x20800,
	            0x1e: 0x820,
	            0x1f: 0x8000000,
	            0x80000010: 0x20000,
	            0x80000011: 0x800,
	            0x80000012: 0x8020020,
	            0x80000013: 0x20820,
	            0x80000014: 0x20,
	            0x80000015: 0x8020000,
	            0x80000016: 0x8000000,
	            0x80000017: 0x8000820,
	            0x80000018: 0x8020820,
	            0x80000019: 0x8000020,
	            0x8000001a: 0x8000800,
	            0x8000001b: 0x0,
	            0x8000001c: 0x20800,
	            0x8000001d: 0x820,
	            0x8000001e: 0x20020,
	            0x8000001f: 0x8020800
	        }
	    ];

	    // Masks that select the SBOX input
	    var SBOX_MASK = [
	        0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
	        0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
	    ];

	    /**
	     * DES block cipher algorithm.
	     */
	    var DES = C_algo.DES = BlockCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var key = this._key;
	            var keyWords = key.words;

	            // Select 56 bits according to PC1
	            var keyBits = [];
	            for (var i = 0; i < 56; i++) {
	                var keyBitPos = PC1[i] - 1;
	                keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
	            }

	            // Assemble 16 subkeys
	            var subKeys = this._subKeys = [];
	            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
	                // Create subkey
	                var subKey = subKeys[nSubKey] = [];

	                // Shortcut
	                var bitShift = BIT_SHIFTS[nSubKey];

	                // Select 48 bits according to PC2
	                for (var i = 0; i < 24; i++) {
	                    // Select from the left 28 key bits
	                    subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);

	                    // Select from the right 28 key bits
	                    subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
	                }

	                // Since each subkey is applied to an expanded 32-bit input,
	                // the subkey can be broken into 8 values scaled to 32-bits,
	                // which allows the key to be used without expansion
	                subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
	                for (var i = 1; i < 7; i++) {
	                    subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
	                }
	                subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
	            }

	            // Compute inverse subkeys
	            var invSubKeys = this._invSubKeys = [];
	            for (var i = 0; i < 16; i++) {
	                invSubKeys[i] = subKeys[15 - i];
	            }
	        },

	        encryptBlock: function (M, offset) {
	            this._doCryptBlock(M, offset, this._subKeys);
	        },

	        decryptBlock: function (M, offset) {
	            this._doCryptBlock(M, offset, this._invSubKeys);
	        },

	        _doCryptBlock: function (M, offset, subKeys) {
	            // Get input
	            this._lBlock = M[offset];
	            this._rBlock = M[offset + 1];

	            // Initial permutation
	            exchangeLR.call(this, 4,  0x0f0f0f0f);
	            exchangeLR.call(this, 16, 0x0000ffff);
	            exchangeRL.call(this, 2,  0x33333333);
	            exchangeRL.call(this, 8,  0x00ff00ff);
	            exchangeLR.call(this, 1,  0x55555555);

	            // Rounds
	            for (var round = 0; round < 16; round++) {
	                // Shortcuts
	                var subKey = subKeys[round];
	                var lBlock = this._lBlock;
	                var rBlock = this._rBlock;

	                // Feistel function
	                var f = 0;
	                for (var i = 0; i < 8; i++) {
	                    f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
	                }
	                this._lBlock = rBlock;
	                this._rBlock = lBlock ^ f;
	            }

	            // Undo swap from last round
	            var t = this._lBlock;
	            this._lBlock = this._rBlock;
	            this._rBlock = t;

	            // Final permutation
	            exchangeLR.call(this, 1,  0x55555555);
	            exchangeRL.call(this, 8,  0x00ff00ff);
	            exchangeRL.call(this, 2,  0x33333333);
	            exchangeLR.call(this, 16, 0x0000ffff);
	            exchangeLR.call(this, 4,  0x0f0f0f0f);

	            // Set output
	            M[offset] = this._lBlock;
	            M[offset + 1] = this._rBlock;
	        },

	        keySize: 64/32,

	        ivSize: 64/32,

	        blockSize: 64/32
	    });

	    // Swap bits across the left and right words
	    function exchangeLR(offset, mask) {
	        var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
	        this._rBlock ^= t;
	        this._lBlock ^= t << offset;
	    }

	    function exchangeRL(offset, mask) {
	        var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
	        this._lBlock ^= t;
	        this._rBlock ^= t << offset;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
	     */
	    C.DES = BlockCipher._createHelper(DES);

	    /**
	     * Triple-DES block cipher algorithm.
	     */
	    var TripleDES = C_algo.TripleDES = BlockCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var key = this._key;
	            var keyWords = key.words;
	            // Make sure the key length is valid (64, 128 or >= 192 bit)
	            if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
	                throw new Error('Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.');
	            }

	            // Extend the key according to the keying options defined in 3DES standard
	            var key1 = keyWords.slice(0, 2);
	            var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
	            var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);

	            // Create DES instances
	            this._des1 = DES.createEncryptor(WordArray.create(key1));
	            this._des2 = DES.createEncryptor(WordArray.create(key2));
	            this._des3 = DES.createEncryptor(WordArray.create(key3));
	        },

	        encryptBlock: function (M, offset) {
	            this._des1.encryptBlock(M, offset);
	            this._des2.decryptBlock(M, offset);
	            this._des3.encryptBlock(M, offset);
	        },

	        decryptBlock: function (M, offset) {
	            this._des3.decryptBlock(M, offset);
	            this._des2.encryptBlock(M, offset);
	            this._des1.decryptBlock(M, offset);
	        },

	        keySize: 192/32,

	        ivSize: 64/32,

	        blockSize: 64/32
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
	     */
	    C.TripleDES = BlockCipher._createHelper(TripleDES);
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var StreamCipher = C_lib.StreamCipher;
	    var C_algo = C.algo;

	    /**
	     * RC4 stream cipher algorithm.
	     */
	    var RC4 = C_algo.RC4 = StreamCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var key = this._key;
	            var keyWords = key.words;
	            var keySigBytes = key.sigBytes;

	            // Init sbox
	            var S = this._S = [];
	            for (var i = 0; i < 256; i++) {
	                S[i] = i;
	            }

	            // Key setup
	            for (var i = 0, j = 0; i < 256; i++) {
	                var keyByteIndex = i % keySigBytes;
	                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

	                j = (j + S[i] + keyByte) % 256;

	                // Swap
	                var t = S[i];
	                S[i] = S[j];
	                S[j] = t;
	            }

	            // Counters
	            this._i = this._j = 0;
	        },

	        _doProcessBlock: function (M, offset) {
	            M[offset] ^= generateKeystreamWord.call(this);
	        },

	        keySize: 256/32,

	        ivSize: 0
	    });

	    function generateKeystreamWord() {
	        // Shortcuts
	        var S = this._S;
	        var i = this._i;
	        var j = this._j;

	        // Generate keystream word
	        var keystreamWord = 0;
	        for (var n = 0; n < 4; n++) {
	            i = (i + 1) % 256;
	            j = (j + S[i]) % 256;

	            // Swap
	            var t = S[i];
	            S[i] = S[j];
	            S[j] = t;

	            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
	        }

	        // Update counters
	        this._i = i;
	        this._j = j;

	        return keystreamWord;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
	     */
	    C.RC4 = StreamCipher._createHelper(RC4);

	    /**
	     * Modified RC4 stream cipher algorithm.
	     */
	    var RC4Drop = C_algo.RC4Drop = RC4.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} drop The number of keystream words to drop. Default 192
	         */
	        cfg: RC4.cfg.extend({
	            drop: 192
	        }),

	        _doReset: function () {
	            RC4._doReset.call(this);

	            // Drop
	            for (var i = this.cfg.drop; i > 0; i--) {
	                generateKeystreamWord.call(this);
	            }
	        }
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
	     */
	    C.RC4Drop = StreamCipher._createHelper(RC4Drop);
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var StreamCipher = C_lib.StreamCipher;
	    var C_algo = C.algo;

	    // Reusable objects
	    var S  = [];
	    var C_ = [];
	    var G  = [];

	    /**
	     * Rabbit stream cipher algorithm
	     */
	    var Rabbit = C_algo.Rabbit = StreamCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var K = this._key.words;
	            var iv = this.cfg.iv;

	            // Swap endian
	            for (var i = 0; i < 4; i++) {
	                K[i] = (((K[i] << 8)  | (K[i] >>> 24)) & 0x00ff00ff) |
	                       (((K[i] << 24) | (K[i] >>> 8))  & 0xff00ff00);
	            }

	            // Generate initial state values
	            var X = this._X = [
	                K[0], (K[3] << 16) | (K[2] >>> 16),
	                K[1], (K[0] << 16) | (K[3] >>> 16),
	                K[2], (K[1] << 16) | (K[0] >>> 16),
	                K[3], (K[2] << 16) | (K[1] >>> 16)
	            ];

	            // Generate initial counter values
	            var C = this._C = [
	                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
	                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
	                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
	                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
	            ];

	            // Carry bit
	            this._b = 0;

	            // Iterate the system four times
	            for (var i = 0; i < 4; i++) {
	                nextState.call(this);
	            }

	            // Modify the counters
	            for (var i = 0; i < 8; i++) {
	                C[i] ^= X[(i + 4) & 7];
	            }

	            // IV setup
	            if (iv) {
	                // Shortcuts
	                var IV = iv.words;
	                var IV_0 = IV[0];
	                var IV_1 = IV[1];

	                // Generate four subvectors
	                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
	                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
	                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
	                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

	                // Modify counter values
	                C[0] ^= i0;
	                C[1] ^= i1;
	                C[2] ^= i2;
	                C[3] ^= i3;
	                C[4] ^= i0;
	                C[5] ^= i1;
	                C[6] ^= i2;
	                C[7] ^= i3;

	                // Iterate the system four times
	                for (var i = 0; i < 4; i++) {
	                    nextState.call(this);
	                }
	            }
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var X = this._X;

	            // Iterate the system
	            nextState.call(this);

	            // Generate four keystream words
	            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
	            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
	            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
	            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

	            for (var i = 0; i < 4; i++) {
	                // Swap endian
	                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
	                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

	                // Encrypt
	                M[offset + i] ^= S[i];
	            }
	        },

	        blockSize: 128/32,

	        ivSize: 64/32
	    });

	    function nextState() {
	        // Shortcuts
	        var X = this._X;
	        var C = this._C;

	        // Save old counter values
	        for (var i = 0; i < 8; i++) {
	            C_[i] = C[i];
	        }

	        // Calculate new counter values
	        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
	        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
	        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
	        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
	        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
	        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
	        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
	        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
	        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

	        // Calculate the g-values
	        for (var i = 0; i < 8; i++) {
	            var gx = X[i] + C[i];

	            // Construct high and low argument for squaring
	            var ga = gx & 0xffff;
	            var gb = gx >>> 16;

	            // Calculate high and low result of squaring
	            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
	            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

	            // High XOR low
	            G[i] = gh ^ gl;
	        }

	        // Calculate new state values
	        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
	        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
	        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
	        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
	        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
	        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
	        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
	        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
	     */
	    C.Rabbit = StreamCipher._createHelper(Rabbit);
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var StreamCipher = C_lib.StreamCipher;
	    var C_algo = C.algo;

	    // Reusable objects
	    var S  = [];
	    var C_ = [];
	    var G  = [];

	    /**
	     * Rabbit stream cipher algorithm.
	     *
	     * This is a legacy version that neglected to convert the key to little-endian.
	     * This error doesn't affect the cipher's security,
	     * but it does affect its compatibility with other implementations.
	     */
	    var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var K = this._key.words;
	            var iv = this.cfg.iv;

	            // Generate initial state values
	            var X = this._X = [
	                K[0], (K[3] << 16) | (K[2] >>> 16),
	                K[1], (K[0] << 16) | (K[3] >>> 16),
	                K[2], (K[1] << 16) | (K[0] >>> 16),
	                K[3], (K[2] << 16) | (K[1] >>> 16)
	            ];

	            // Generate initial counter values
	            var C = this._C = [
	                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
	                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
	                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
	                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
	            ];

	            // Carry bit
	            this._b = 0;

	            // Iterate the system four times
	            for (var i = 0; i < 4; i++) {
	                nextState.call(this);
	            }

	            // Modify the counters
	            for (var i = 0; i < 8; i++) {
	                C[i] ^= X[(i + 4) & 7];
	            }

	            // IV setup
	            if (iv) {
	                // Shortcuts
	                var IV = iv.words;
	                var IV_0 = IV[0];
	                var IV_1 = IV[1];

	                // Generate four subvectors
	                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
	                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
	                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
	                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

	                // Modify counter values
	                C[0] ^= i0;
	                C[1] ^= i1;
	                C[2] ^= i2;
	                C[3] ^= i3;
	                C[4] ^= i0;
	                C[5] ^= i1;
	                C[6] ^= i2;
	                C[7] ^= i3;

	                // Iterate the system four times
	                for (var i = 0; i < 4; i++) {
	                    nextState.call(this);
	                }
	            }
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var X = this._X;

	            // Iterate the system
	            nextState.call(this);

	            // Generate four keystream words
	            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
	            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
	            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
	            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

	            for (var i = 0; i < 4; i++) {
	                // Swap endian
	                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
	                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

	                // Encrypt
	                M[offset + i] ^= S[i];
	            }
	        },

	        blockSize: 128/32,

	        ivSize: 64/32
	    });

	    function nextState() {
	        // Shortcuts
	        var X = this._X;
	        var C = this._C;

	        // Save old counter values
	        for (var i = 0; i < 8; i++) {
	            C_[i] = C[i];
	        }

	        // Calculate new counter values
	        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
	        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
	        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
	        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
	        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
	        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
	        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
	        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
	        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

	        // Calculate the g-values
	        for (var i = 0; i < 8; i++) {
	            var gx = X[i] + C[i];

	            // Construct high and low argument for squaring
	            var ga = gx & 0xffff;
	            var gb = gx >>> 16;

	            // Calculate high and low result of squaring
	            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
	            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

	            // High XOR low
	            G[i] = gh ^ gl;
	        }

	        // Calculate new state values
	        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
	        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
	        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
	        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
	        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
	        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
	        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
	        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
	     */
	    C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
	}());


	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var BlockCipher = C_lib.BlockCipher;
	    var C_algo = C.algo;

	    const N = 16;

	    //Origin pbox and sbox, derived from PI
	    const ORIG_P = [
	        0x243F6A88, 0x85A308D3, 0x13198A2E, 0x03707344,
	        0xA4093822, 0x299F31D0, 0x082EFA98, 0xEC4E6C89,
	        0x452821E6, 0x38D01377, 0xBE5466CF, 0x34E90C6C,
	        0xC0AC29B7, 0xC97C50DD, 0x3F84D5B5, 0xB5470917,
	        0x9216D5D9, 0x8979FB1B
	    ];

	    const ORIG_S = [
	        [   0xD1310BA6, 0x98DFB5AC, 0x2FFD72DB, 0xD01ADFB7,
	            0xB8E1AFED, 0x6A267E96, 0xBA7C9045, 0xF12C7F99,
	            0x24A19947, 0xB3916CF7, 0x0801F2E2, 0x858EFC16,
	            0x636920D8, 0x71574E69, 0xA458FEA3, 0xF4933D7E,
	            0x0D95748F, 0x728EB658, 0x718BCD58, 0x82154AEE,
	            0x7B54A41D, 0xC25A59B5, 0x9C30D539, 0x2AF26013,
	            0xC5D1B023, 0x286085F0, 0xCA417918, 0xB8DB38EF,
	            0x8E79DCB0, 0x603A180E, 0x6C9E0E8B, 0xB01E8A3E,
	            0xD71577C1, 0xBD314B27, 0x78AF2FDA, 0x55605C60,
	            0xE65525F3, 0xAA55AB94, 0x57489862, 0x63E81440,
	            0x55CA396A, 0x2AAB10B6, 0xB4CC5C34, 0x1141E8CE,
	            0xA15486AF, 0x7C72E993, 0xB3EE1411, 0x636FBC2A,
	            0x2BA9C55D, 0x741831F6, 0xCE5C3E16, 0x9B87931E,
	            0xAFD6BA33, 0x6C24CF5C, 0x7A325381, 0x28958677,
	            0x3B8F4898, 0x6B4BB9AF, 0xC4BFE81B, 0x66282193,
	            0x61D809CC, 0xFB21A991, 0x487CAC60, 0x5DEC8032,
	            0xEF845D5D, 0xE98575B1, 0xDC262302, 0xEB651B88,
	            0x23893E81, 0xD396ACC5, 0x0F6D6FF3, 0x83F44239,
	            0x2E0B4482, 0xA4842004, 0x69C8F04A, 0x9E1F9B5E,
	            0x21C66842, 0xF6E96C9A, 0x670C9C61, 0xABD388F0,
	            0x6A51A0D2, 0xD8542F68, 0x960FA728, 0xAB5133A3,
	            0x6EEF0B6C, 0x137A3BE4, 0xBA3BF050, 0x7EFB2A98,
	            0xA1F1651D, 0x39AF0176, 0x66CA593E, 0x82430E88,
	            0x8CEE8619, 0x456F9FB4, 0x7D84A5C3, 0x3B8B5EBE,
	            0xE06F75D8, 0x85C12073, 0x401A449F, 0x56C16AA6,
	            0x4ED3AA62, 0x363F7706, 0x1BFEDF72, 0x429B023D,
	            0x37D0D724, 0xD00A1248, 0xDB0FEAD3, 0x49F1C09B,
	            0x075372C9, 0x80991B7B, 0x25D479D8, 0xF6E8DEF7,
	            0xE3FE501A, 0xB6794C3B, 0x976CE0BD, 0x04C006BA,
	            0xC1A94FB6, 0x409F60C4, 0x5E5C9EC2, 0x196A2463,
	            0x68FB6FAF, 0x3E6C53B5, 0x1339B2EB, 0x3B52EC6F,
	            0x6DFC511F, 0x9B30952C, 0xCC814544, 0xAF5EBD09,
	            0xBEE3D004, 0xDE334AFD, 0x660F2807, 0x192E4BB3,
	            0xC0CBA857, 0x45C8740F, 0xD20B5F39, 0xB9D3FBDB,
	            0x5579C0BD, 0x1A60320A, 0xD6A100C6, 0x402C7279,
	            0x679F25FE, 0xFB1FA3CC, 0x8EA5E9F8, 0xDB3222F8,
	            0x3C7516DF, 0xFD616B15, 0x2F501EC8, 0xAD0552AB,
	            0x323DB5FA, 0xFD238760, 0x53317B48, 0x3E00DF82,
	            0x9E5C57BB, 0xCA6F8CA0, 0x1A87562E, 0xDF1769DB,
	            0xD542A8F6, 0x287EFFC3, 0xAC6732C6, 0x8C4F5573,
	            0x695B27B0, 0xBBCA58C8, 0xE1FFA35D, 0xB8F011A0,
	            0x10FA3D98, 0xFD2183B8, 0x4AFCB56C, 0x2DD1D35B,
	            0x9A53E479, 0xB6F84565, 0xD28E49BC, 0x4BFB9790,
	            0xE1DDF2DA, 0xA4CB7E33, 0x62FB1341, 0xCEE4C6E8,
	            0xEF20CADA, 0x36774C01, 0xD07E9EFE, 0x2BF11FB4,
	            0x95DBDA4D, 0xAE909198, 0xEAAD8E71, 0x6B93D5A0,
	            0xD08ED1D0, 0xAFC725E0, 0x8E3C5B2F, 0x8E7594B7,
	            0x8FF6E2FB, 0xF2122B64, 0x8888B812, 0x900DF01C,
	            0x4FAD5EA0, 0x688FC31C, 0xD1CFF191, 0xB3A8C1AD,
	            0x2F2F2218, 0xBE0E1777, 0xEA752DFE, 0x8B021FA1,
	            0xE5A0CC0F, 0xB56F74E8, 0x18ACF3D6, 0xCE89E299,
	            0xB4A84FE0, 0xFD13E0B7, 0x7CC43B81, 0xD2ADA8D9,
	            0x165FA266, 0x80957705, 0x93CC7314, 0x211A1477,
	            0xE6AD2065, 0x77B5FA86, 0xC75442F5, 0xFB9D35CF,
	            0xEBCDAF0C, 0x7B3E89A0, 0xD6411BD3, 0xAE1E7E49,
	            0x00250E2D, 0x2071B35E, 0x226800BB, 0x57B8E0AF,
	            0x2464369B, 0xF009B91E, 0x5563911D, 0x59DFA6AA,
	            0x78C14389, 0xD95A537F, 0x207D5BA2, 0x02E5B9C5,
	            0x83260376, 0x6295CFA9, 0x11C81968, 0x4E734A41,
	            0xB3472DCA, 0x7B14A94A, 0x1B510052, 0x9A532915,
	            0xD60F573F, 0xBC9BC6E4, 0x2B60A476, 0x81E67400,
	            0x08BA6FB5, 0x571BE91F, 0xF296EC6B, 0x2A0DD915,
	            0xB6636521, 0xE7B9F9B6, 0xFF34052E, 0xC5855664,
	            0x53B02D5D, 0xA99F8FA1, 0x08BA4799, 0x6E85076A   ],
	        [   0x4B7A70E9, 0xB5B32944, 0xDB75092E, 0xC4192623,
	            0xAD6EA6B0, 0x49A7DF7D, 0x9CEE60B8, 0x8FEDB266,
	            0xECAA8C71, 0x699A17FF, 0x5664526C, 0xC2B19EE1,
	            0x193602A5, 0x75094C29, 0xA0591340, 0xE4183A3E,
	            0x3F54989A, 0x5B429D65, 0x6B8FE4D6, 0x99F73FD6,
	            0xA1D29C07, 0xEFE830F5, 0x4D2D38E6, 0xF0255DC1,
	            0x4CDD2086, 0x8470EB26, 0x6382E9C6, 0x021ECC5E,
	            0x09686B3F, 0x3EBAEFC9, 0x3C971814, 0x6B6A70A1,
	            0x687F3584, 0x52A0E286, 0xB79C5305, 0xAA500737,
	            0x3E07841C, 0x7FDEAE5C, 0x8E7D44EC, 0x5716F2B8,
	            0xB03ADA37, 0xF0500C0D, 0xF01C1F04, 0x0200B3FF,
	            0xAE0CF51A, 0x3CB574B2, 0x25837A58, 0xDC0921BD,
	            0xD19113F9, 0x7CA92FF6, 0x94324773, 0x22F54701,
	            0x3AE5E581, 0x37C2DADC, 0xC8B57634, 0x9AF3DDA7,
	            0xA9446146, 0x0FD0030E, 0xECC8C73E, 0xA4751E41,
	            0xE238CD99, 0x3BEA0E2F, 0x3280BBA1, 0x183EB331,
	            0x4E548B38, 0x4F6DB908, 0x6F420D03, 0xF60A04BF,
	            0x2CB81290, 0x24977C79, 0x5679B072, 0xBCAF89AF,
	            0xDE9A771F, 0xD9930810, 0xB38BAE12, 0xDCCF3F2E,
	            0x5512721F, 0x2E6B7124, 0x501ADDE6, 0x9F84CD87,
	            0x7A584718, 0x7408DA17, 0xBC9F9ABC, 0xE94B7D8C,
	            0xEC7AEC3A, 0xDB851DFA, 0x63094366, 0xC464C3D2,
	            0xEF1C1847, 0x3215D908, 0xDD433B37, 0x24C2BA16,
	            0x12A14D43, 0x2A65C451, 0x50940002, 0x133AE4DD,
	            0x71DFF89E, 0x10314E55, 0x81AC77D6, 0x5F11199B,
	            0x043556F1, 0xD7A3C76B, 0x3C11183B, 0x5924A509,
	            0xF28FE6ED, 0x97F1FBFA, 0x9EBABF2C, 0x1E153C6E,
	            0x86E34570, 0xEAE96FB1, 0x860E5E0A, 0x5A3E2AB3,
	            0x771FE71C, 0x4E3D06FA, 0x2965DCB9, 0x99E71D0F,
	            0x803E89D6, 0x5266C825, 0x2E4CC978, 0x9C10B36A,
	            0xC6150EBA, 0x94E2EA78, 0xA5FC3C53, 0x1E0A2DF4,
	            0xF2F74EA7, 0x361D2B3D, 0x1939260F, 0x19C27960,
	            0x5223A708, 0xF71312B6, 0xEBADFE6E, 0xEAC31F66,
	            0xE3BC4595, 0xA67BC883, 0xB17F37D1, 0x018CFF28,
	            0xC332DDEF, 0xBE6C5AA5, 0x65582185, 0x68AB9802,
	            0xEECEA50F, 0xDB2F953B, 0x2AEF7DAD, 0x5B6E2F84,
	            0x1521B628, 0x29076170, 0xECDD4775, 0x619F1510,
	            0x13CCA830, 0xEB61BD96, 0x0334FE1E, 0xAA0363CF,
	            0xB5735C90, 0x4C70A239, 0xD59E9E0B, 0xCBAADE14,
	            0xEECC86BC, 0x60622CA7, 0x9CAB5CAB, 0xB2F3846E,
	            0x648B1EAF, 0x19BDF0CA, 0xA02369B9, 0x655ABB50,
	            0x40685A32, 0x3C2AB4B3, 0x319EE9D5, 0xC021B8F7,
	            0x9B540B19, 0x875FA099, 0x95F7997E, 0x623D7DA8,
	            0xF837889A, 0x97E32D77, 0x11ED935F, 0x16681281,
	            0x0E358829, 0xC7E61FD6, 0x96DEDFA1, 0x7858BA99,
	            0x57F584A5, 0x1B227263, 0x9B83C3FF, 0x1AC24696,
	            0xCDB30AEB, 0x532E3054, 0x8FD948E4, 0x6DBC3128,
	            0x58EBF2EF, 0x34C6FFEA, 0xFE28ED61, 0xEE7C3C73,
	            0x5D4A14D9, 0xE864B7E3, 0x42105D14, 0x203E13E0,
	            0x45EEE2B6, 0xA3AAABEA, 0xDB6C4F15, 0xFACB4FD0,
	            0xC742F442, 0xEF6ABBB5, 0x654F3B1D, 0x41CD2105,
	            0xD81E799E, 0x86854DC7, 0xE44B476A, 0x3D816250,
	            0xCF62A1F2, 0x5B8D2646, 0xFC8883A0, 0xC1C7B6A3,
	            0x7F1524C3, 0x69CB7492, 0x47848A0B, 0x5692B285,
	            0x095BBF00, 0xAD19489D, 0x1462B174, 0x23820E00,
	            0x58428D2A, 0x0C55F5EA, 0x1DADF43E, 0x233F7061,
	            0x3372F092, 0x8D937E41, 0xD65FECF1, 0x6C223BDB,
	            0x7CDE3759, 0xCBEE7460, 0x4085F2A7, 0xCE77326E,
	            0xA6078084, 0x19F8509E, 0xE8EFD855, 0x61D99735,
	            0xA969A7AA, 0xC50C06C2, 0x5A04ABFC, 0x800BCADC,
	            0x9E447A2E, 0xC3453484, 0xFDD56705, 0x0E1E9EC9,
	            0xDB73DBD3, 0x105588CD, 0x675FDA79, 0xE3674340,
	            0xC5C43465, 0x713E38D8, 0x3D28F89E, 0xF16DFF20,
	            0x153E21E7, 0x8FB03D4A, 0xE6E39F2B, 0xDB83ADF7   ],
	        [   0xE93D5A68, 0x948140F7, 0xF64C261C, 0x94692934,
	            0x411520F7, 0x7602D4F7, 0xBCF46B2E, 0xD4A20068,
	            0xD4082471, 0x3320F46A, 0x43B7D4B7, 0x500061AF,
	            0x1E39F62E, 0x97244546, 0x14214F74, 0xBF8B8840,
	            0x4D95FC1D, 0x96B591AF, 0x70F4DDD3, 0x66A02F45,
	            0xBFBC09EC, 0x03BD9785, 0x7FAC6DD0, 0x31CB8504,
	            0x96EB27B3, 0x55FD3941, 0xDA2547E6, 0xABCA0A9A,
	            0x28507825, 0x530429F4, 0x0A2C86DA, 0xE9B66DFB,
	            0x68DC1462, 0xD7486900, 0x680EC0A4, 0x27A18DEE,
	            0x4F3FFEA2, 0xE887AD8C, 0xB58CE006, 0x7AF4D6B6,
	            0xAACE1E7C, 0xD3375FEC, 0xCE78A399, 0x406B2A42,
	            0x20FE9E35, 0xD9F385B9, 0xEE39D7AB, 0x3B124E8B,
	            0x1DC9FAF7, 0x4B6D1856, 0x26A36631, 0xEAE397B2,
	            0x3A6EFA74, 0xDD5B4332, 0x6841E7F7, 0xCA7820FB,
	            0xFB0AF54E, 0xD8FEB397, 0x454056AC, 0xBA489527,
	            0x55533A3A, 0x20838D87, 0xFE6BA9B7, 0xD096954B,
	            0x55A867BC, 0xA1159A58, 0xCCA92963, 0x99E1DB33,
	            0xA62A4A56, 0x3F3125F9, 0x5EF47E1C, 0x9029317C,
	            0xFDF8E802, 0x04272F70, 0x80BB155C, 0x05282CE3,
	            0x95C11548, 0xE4C66D22, 0x48C1133F, 0xC70F86DC,
	            0x07F9C9EE, 0x41041F0F, 0x404779A4, 0x5D886E17,
	            0x325F51EB, 0xD59BC0D1, 0xF2BCC18F, 0x41113564,
	            0x257B7834, 0x602A9C60, 0xDFF8E8A3, 0x1F636C1B,
	            0x0E12B4C2, 0x02E1329E, 0xAF664FD1, 0xCAD18115,
	            0x6B2395E0, 0x333E92E1, 0x3B240B62, 0xEEBEB922,
	            0x85B2A20E, 0xE6BA0D99, 0xDE720C8C, 0x2DA2F728,
	            0xD0127845, 0x95B794FD, 0x647D0862, 0xE7CCF5F0,
	            0x5449A36F, 0x877D48FA, 0xC39DFD27, 0xF33E8D1E,
	            0x0A476341, 0x992EFF74, 0x3A6F6EAB, 0xF4F8FD37,
	            0xA812DC60, 0xA1EBDDF8, 0x991BE14C, 0xDB6E6B0D,
	            0xC67B5510, 0x6D672C37, 0x2765D43B, 0xDCD0E804,
	            0xF1290DC7, 0xCC00FFA3, 0xB5390F92, 0x690FED0B,
	            0x667B9FFB, 0xCEDB7D9C, 0xA091CF0B, 0xD9155EA3,
	            0xBB132F88, 0x515BAD24, 0x7B9479BF, 0x763BD6EB,
	            0x37392EB3, 0xCC115979, 0x8026E297, 0xF42E312D,
	            0x6842ADA7, 0xC66A2B3B, 0x12754CCC, 0x782EF11C,
	            0x6A124237, 0xB79251E7, 0x06A1BBE6, 0x4BFB6350,
	            0x1A6B1018, 0x11CAEDFA, 0x3D25BDD8, 0xE2E1C3C9,
	            0x44421659, 0x0A121386, 0xD90CEC6E, 0xD5ABEA2A,
	            0x64AF674E, 0xDA86A85F, 0xBEBFE988, 0x64E4C3FE,
	            0x9DBC8057, 0xF0F7C086, 0x60787BF8, 0x6003604D,
	            0xD1FD8346, 0xF6381FB0, 0x7745AE04, 0xD736FCCC,
	            0x83426B33, 0xF01EAB71, 0xB0804187, 0x3C005E5F,
	            0x77A057BE, 0xBDE8AE24, 0x55464299, 0xBF582E61,
	            0x4E58F48F, 0xF2DDFDA2, 0xF474EF38, 0x8789BDC2,
	            0x5366F9C3, 0xC8B38E74, 0xB475F255, 0x46FCD9B9,
	            0x7AEB2661, 0x8B1DDF84, 0x846A0E79, 0x915F95E2,
	            0x466E598E, 0x20B45770, 0x8CD55591, 0xC902DE4C,
	            0xB90BACE1, 0xBB8205D0, 0x11A86248, 0x7574A99E,
	            0xB77F19B6, 0xE0A9DC09, 0x662D09A1, 0xC4324633,
	            0xE85A1F02, 0x09F0BE8C, 0x4A99A025, 0x1D6EFE10,
	            0x1AB93D1D, 0x0BA5A4DF, 0xA186F20F, 0x2868F169,
	            0xDCB7DA83, 0x573906FE, 0xA1E2CE9B, 0x4FCD7F52,
	            0x50115E01, 0xA70683FA, 0xA002B5C4, 0x0DE6D027,
	            0x9AF88C27, 0x773F8641, 0xC3604C06, 0x61A806B5,
	            0xF0177A28, 0xC0F586E0, 0x006058AA, 0x30DC7D62,
	            0x11E69ED7, 0x2338EA63, 0x53C2DD94, 0xC2C21634,
	            0xBBCBEE56, 0x90BCB6DE, 0xEBFC7DA1, 0xCE591D76,
	            0x6F05E409, 0x4B7C0188, 0x39720A3D, 0x7C927C24,
	            0x86E3725F, 0x724D9DB9, 0x1AC15BB4, 0xD39EB8FC,
	            0xED545578, 0x08FCA5B5, 0xD83D7CD3, 0x4DAD0FC4,
	            0x1E50EF5E, 0xB161E6F8, 0xA28514D9, 0x6C51133C,
	            0x6FD5C7E7, 0x56E14EC4, 0x362ABFCE, 0xDDC6C837,
	            0xD79A3234, 0x92638212, 0x670EFA8E, 0x406000E0  ],
	        [   0x3A39CE37, 0xD3FAF5CF, 0xABC27737, 0x5AC52D1B,
	            0x5CB0679E, 0x4FA33742, 0xD3822740, 0x99BC9BBE,
	            0xD5118E9D, 0xBF0F7315, 0xD62D1C7E, 0xC700C47B,
	            0xB78C1B6B, 0x21A19045, 0xB26EB1BE, 0x6A366EB4,
	            0x5748AB2F, 0xBC946E79, 0xC6A376D2, 0x6549C2C8,
	            0x530FF8EE, 0x468DDE7D, 0xD5730A1D, 0x4CD04DC6,
	            0x2939BBDB, 0xA9BA4650, 0xAC9526E8, 0xBE5EE304,
	            0xA1FAD5F0, 0x6A2D519A, 0x63EF8CE2, 0x9A86EE22,
	            0xC089C2B8, 0x43242EF6, 0xA51E03AA, 0x9CF2D0A4,
	            0x83C061BA, 0x9BE96A4D, 0x8FE51550, 0xBA645BD6,
	            0x2826A2F9, 0xA73A3AE1, 0x4BA99586, 0xEF5562E9,
	            0xC72FEFD3, 0xF752F7DA, 0x3F046F69, 0x77FA0A59,
	            0x80E4A915, 0x87B08601, 0x9B09E6AD, 0x3B3EE593,
	            0xE990FD5A, 0x9E34D797, 0x2CF0B7D9, 0x022B8B51,
	            0x96D5AC3A, 0x017DA67D, 0xD1CF3ED6, 0x7C7D2D28,
	            0x1F9F25CF, 0xADF2B89B, 0x5AD6B472, 0x5A88F54C,
	            0xE029AC71, 0xE019A5E6, 0x47B0ACFD, 0xED93FA9B,
	            0xE8D3C48D, 0x283B57CC, 0xF8D56629, 0x79132E28,
	            0x785F0191, 0xED756055, 0xF7960E44, 0xE3D35E8C,
	            0x15056DD4, 0x88F46DBA, 0x03A16125, 0x0564F0BD,
	            0xC3EB9E15, 0x3C9057A2, 0x97271AEC, 0xA93A072A,
	            0x1B3F6D9B, 0x1E6321F5, 0xF59C66FB, 0x26DCF319,
	            0x7533D928, 0xB155FDF5, 0x03563482, 0x8ABA3CBB,
	            0x28517711, 0xC20AD9F8, 0xABCC5167, 0xCCAD925F,
	            0x4DE81751, 0x3830DC8E, 0x379D5862, 0x9320F991,
	            0xEA7A90C2, 0xFB3E7BCE, 0x5121CE64, 0x774FBE32,
	            0xA8B6E37E, 0xC3293D46, 0x48DE5369, 0x6413E680,
	            0xA2AE0810, 0xDD6DB224, 0x69852DFD, 0x09072166,
	            0xB39A460A, 0x6445C0DD, 0x586CDECF, 0x1C20C8AE,
	            0x5BBEF7DD, 0x1B588D40, 0xCCD2017F, 0x6BB4E3BB,
	            0xDDA26A7E, 0x3A59FF45, 0x3E350A44, 0xBCB4CDD5,
	            0x72EACEA8, 0xFA6484BB, 0x8D6612AE, 0xBF3C6F47,
	            0xD29BE463, 0x542F5D9E, 0xAEC2771B, 0xF64E6370,
	            0x740E0D8D, 0xE75B1357, 0xF8721671, 0xAF537D5D,
	            0x4040CB08, 0x4EB4E2CC, 0x34D2466A, 0x0115AF84,
	            0xE1B00428, 0x95983A1D, 0x06B89FB4, 0xCE6EA048,
	            0x6F3F3B82, 0x3520AB82, 0x011A1D4B, 0x277227F8,
	            0x611560B1, 0xE7933FDC, 0xBB3A792B, 0x344525BD,
	            0xA08839E1, 0x51CE794B, 0x2F32C9B7, 0xA01FBAC9,
	            0xE01CC87E, 0xBCC7D1F6, 0xCF0111C3, 0xA1E8AAC7,
	            0x1A908749, 0xD44FBD9A, 0xD0DADECB, 0xD50ADA38,
	            0x0339C32A, 0xC6913667, 0x8DF9317C, 0xE0B12B4F,
	            0xF79E59B7, 0x43F5BB3A, 0xF2D519FF, 0x27D9459C,
	            0xBF97222C, 0x15E6FC2A, 0x0F91FC71, 0x9B941525,
	            0xFAE59361, 0xCEB69CEB, 0xC2A86459, 0x12BAA8D1,
	            0xB6C1075E, 0xE3056A0C, 0x10D25065, 0xCB03A442,
	            0xE0EC6E0E, 0x1698DB3B, 0x4C98A0BE, 0x3278E964,
	            0x9F1F9532, 0xE0D392DF, 0xD3A0342B, 0x8971F21E,
	            0x1B0A7441, 0x4BA3348C, 0xC5BE7120, 0xC37632D8,
	            0xDF359F8D, 0x9B992F2E, 0xE60B6F47, 0x0FE3F11D,
	            0xE54CDA54, 0x1EDAD891, 0xCE6279CF, 0xCD3E7E6F,
	            0x1618B166, 0xFD2C1D05, 0x848FD2C5, 0xF6FB2299,
	            0xF523F357, 0xA6327623, 0x93A83531, 0x56CCCD02,
	            0xACF08162, 0x5A75EBB5, 0x6E163697, 0x88D273CC,
	            0xDE966292, 0x81B949D0, 0x4C50901B, 0x71C65614,
	            0xE6C6C7BD, 0x327A140A, 0x45E1D006, 0xC3F27B9A,
	            0xC9AA53FD, 0x62A80F00, 0xBB25BFE2, 0x35BDD2F6,
	            0x71126905, 0xB2040222, 0xB6CBCF7C, 0xCD769C2B,
	            0x53113EC0, 0x1640E3D3, 0x38ABBD60, 0x2547ADF0,
	            0xBA38209C, 0xF746CE76, 0x77AFA1C5, 0x20756060,
	            0x85CBFE4E, 0x8AE88DD8, 0x7AAAF9B0, 0x4CF9AA7E,
	            0x1948C25C, 0x02FB8A8C, 0x01C36AE4, 0xD6EBE1F9,
	            0x90D4F869, 0xA65CDEA0, 0x3F09252D, 0xC208E69F,
	            0xB74E6132, 0xCE77E25B, 0x578FDFE3, 0x3AC372E6  ]
	    ];

	    var BLOWFISH_CTX = {
	        pbox: [],
	        sbox: []
	    }

	    function F(ctx, x){
	        let a = (x >> 24) & 0xFF;
	        let b = (x >> 16) & 0xFF;
	        let c = (x >> 8) & 0xFF;
	        let d = x & 0xFF;

	        let y = ctx.sbox[0][a] + ctx.sbox[1][b];
	        y = y ^ ctx.sbox[2][c];
	        y = y + ctx.sbox[3][d];

	        return y;
	    }

	    function BlowFish_Encrypt(ctx, left, right){
	        let Xl = left;
	        let Xr = right;
	        let temp;

	        for(let i = 0; i < N; ++i){
	            Xl = Xl ^ ctx.pbox[i];
	            Xr = F(ctx, Xl) ^ Xr;

	            temp = Xl;
	            Xl = Xr;
	            Xr = temp;
	        }

	        temp = Xl;
	        Xl = Xr;
	        Xr = temp;

	        Xr = Xr ^ ctx.pbox[N];
	        Xl = Xl ^ ctx.pbox[N + 1];

	        return {left: Xl, right: Xr};
	    }

	    function BlowFish_Decrypt(ctx, left, right){
	        let Xl = left;
	        let Xr = right;
	        let temp;

	        for(let i = N + 1; i > 1; --i){
	            Xl = Xl ^ ctx.pbox[i];
	            Xr = F(ctx, Xl) ^ Xr;

	            temp = Xl;
	            Xl = Xr;
	            Xr = temp;
	        }

	        temp = Xl;
	        Xl = Xr;
	        Xr = temp;

	        Xr = Xr ^ ctx.pbox[1];
	        Xl = Xl ^ ctx.pbox[0];

	        return {left: Xl, right: Xr};
	    }

	    /**
	     * Initialization ctx's pbox and sbox.
	     *
	     * @param {Object} ctx The object has pbox and sbox.
	     * @param {Array} key An array of 32-bit words.
	     * @param {int} keysize The length of the key.
	     *
	     * @example
	     *
	     *     BlowFishInit(BLOWFISH_CTX, key, 128/32);
	     */
	    function BlowFishInit(ctx, key, keysize)
	    {
	        for(let Row = 0; Row < 4; Row++)
	        {
	            ctx.sbox[Row] = [];
	            for(let Col = 0; Col < 256; Col++)
	            {
	                ctx.sbox[Row][Col] = ORIG_S[Row][Col];
	            }
	        }

	        let keyIndex = 0;
	        for(let index = 0; index < N + 2; index++)
	        {
	            ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
	            keyIndex++;
	            if(keyIndex >= keysize)
	            {
	                keyIndex = 0;
	            }
	        }

	        let Data1 = 0;
	        let Data2 = 0;
	        let res = 0;
	        for(let i = 0; i < N + 2; i += 2)
	        {
	            res = BlowFish_Encrypt(ctx, Data1, Data2);
	            Data1 = res.left;
	            Data2 = res.right;
	            ctx.pbox[i] = Data1;
	            ctx.pbox[i + 1] = Data2;
	        }

	        for(let i = 0; i < 4; i++)
	        {
	            for(let j = 0; j < 256; j += 2)
	            {
	                res = BlowFish_Encrypt(ctx, Data1, Data2);
	                Data1 = res.left;
	                Data2 = res.right;
	                ctx.sbox[i][j] = Data1;
	                ctx.sbox[i][j + 1] = Data2;
	            }
	        }

	        return true;
	    }

	    /**
	     * Blowfish block cipher algorithm.
	     */
	    var Blowfish = C_algo.Blowfish = BlockCipher.extend({
	        _doReset: function () {
	            // Skip reset of nRounds has been set before and key did not change
	            if (this._keyPriorReset === this._key) {
	                return;
	            }

	            // Shortcuts
	            var key = this._keyPriorReset = this._key;
	            var keyWords = key.words;
	            var keySize = key.sigBytes / 4;

	            //Initialization pbox and sbox
	            BlowFishInit(BLOWFISH_CTX, keyWords, keySize);
	        },

	        encryptBlock: function (M, offset) {
	            var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
	            M[offset] = res.left;
	            M[offset + 1] = res.right;
	        },

	        decryptBlock: function (M, offset) {
	            var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
	            M[offset] = res.left;
	            M[offset + 1] = res.right;
	        },

	        blockSize: 64/32,

	        keySize: 128/32,

	        ivSize: 64/32
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.Blowfish.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.Blowfish.decrypt(ciphertext, key, cfg);
	     */
	    C.Blowfish = BlockCipher._createHelper(Blowfish);
	}());


	return CryptoJS;

}));
  return module.exports;
})();

var __xuperStorage = new Map();
function __xuperNow() { return Date.now(); }
function __xuperStorageSet(key, value, options) {
  var ttl = options && typeof options.ttlMs === "number" ? options.ttlMs : 0;
  __xuperStorage.set(String(key), {
    value: String(value),
    expiresAt: ttl > 0 ? __xuperNow() + ttl : 0
  });
}
function __xuperStorageGet(key) {
  var item = __xuperStorage.get(String(key));
  if (!item) return null;
  if (item.expiresAt && item.expiresAt <= __xuperNow()) {
    __xuperStorage.delete(String(key));
    return null;
  }
  return item.value;
}
function __xuperStorageRemove(key) { __xuperStorage.delete(String(key)); }
function __xuperStorageKeys() { return Array.from(__xuperStorage.keys()); }

function __xuperTmdbKey() {
  try {
    return typeof TMDB_API_KEY !== "undefined" && TMDB_API_KEY ? String(TMDB_API_KEY) : "";
  } catch (_) {
    return "";
  }
}

function __xuperFetch(url, options) {
  options = options || {};
  var headers = options.headers || {};
  var init = {
    method: String(options.method || "GET").toUpperCase(),
    headers: headers,
    redirect: options.followRedirects === false ? "manual" : "follow"
  };
  if (options.body !== undefined && options.body !== null) init.body = String(options.body);
  return fetch(String(url), init).then(function (response) {
    return response.text().then(function (body) {
      var contentType = response.headers && response.headers.get ? (response.headers.get("content-type") || "") : "";
      var contentEncoding = response.headers && response.headers.get ? (response.headers.get("content-encoding") || "") : "";
      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: {
          get: function (name) {
            if (!response.headers || !response.headers.get) return null;
            return response.headers.get(String(name));
          },
          "content-type": contentType,
          "content-encoding": contentEncoding
        },
        text: function () { return body; },
        json: function () { return JSON.parse(body); }
      };
    });
  });
}

var kino = {
  fetch: __xuperFetch,
  storage: {
    get: __xuperStorageGet,
    set: __xuperStorageSet,
    remove: __xuperStorageRemove,
    keys: __xuperStorageKeys
  },
  crypto: {
    hash: function (algorithm, text) {
      var name = String(algorithm || "sha256").toLowerCase();
      if (name === "md5") return CryptoJS.MD5(String(text)).toString();
      if (name === "sha256") return CryptoJS.SHA256(String(text)).toString();
      throw new Error("unsupported hash " + algorithm);
    },
    randomBytes: function (count) {
      return CryptoJS.lib.WordArray.random(Number(count) || 0).toString();
    },
    encrypt: function (algorithm, options) {
      options = options || {};
      if (algorithm === "des-ede3-ecb") {
        return CryptoJS.TripleDES.encrypt(
          CryptoJS.enc.Utf8.parse(String(options.data || "")),
          CryptoJS.enc.Hex.parse(String(options.key || "")),
          { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
        ).toString();
      }
      if (algorithm === "aes-128-ecb") {
        return CryptoJS.AES.encrypt(
          CryptoJS.enc.Hex.parse(String(options.data || "")),
          CryptoJS.enc.Utf8.parse(String(options.key || "")),
          { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
        ).toString();
      }
      throw new Error("unsupported encrypt " + algorithm);
    },
    decrypt: function (algorithm, options) {
      options = options || {};
      if (algorithm === "des-ede3-ecb") {
        return CryptoJS.TripleDES.decrypt(
          { ciphertext: CryptoJS.enc.Base64.parse(String(options.data || "")) },
          CryptoJS.enc.Hex.parse(String(options.key || "")),
          { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
        ).toString(CryptoJS.enc.Utf8);
      }
      if (algorithm === "aes-128-ecb") {
        return CryptoJS.AES.decrypt(
          { ciphertext: CryptoJS.enc.Base64.parse(String(options.data || "")) },
          CryptoJS.enc.Utf8.parse(String(options.key || "")),
          { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
        ).toString(CryptoJS.enc.Utf8);
      }
      throw new Error("unsupported decrypt " + algorithm);
    }
  },
  config: {
    get: function (key) {
      if (key === "useSharedAccount" || key === "contribute") return false;
      if (key === "autoRefreshSeeds") return true;
      return undefined;
    }
  },
  error: function (code, message) {
    var error = new Error(message == null ? String(code) : String(message));
    error.name = "KinoError_" + String(code);
    error.code = String(code);
    return error;
  },
  log: function (line) { console.log(String(line == null ? "" : line)); },
  sleep: function (milliseconds) {
    return new Promise(function (resolve) { setTimeout(resolve, Number(milliseconds) || 0); });
  },
  lang: "es",
  appVersion: "49902",
  secret: function (name) {
    if (name === "magisKey") return __XUPER_MAGIS_KEY;
    if (name === "tmdbKey") return __xuperTmdbKey();
    throw new Error("unsupported secret " + name);
  },
  tmdb: function (path, params) {
    var key = __xuperTmdbKey();
    if (!key) return Promise.reject(new Error("TMDB key unavailable"));
    var query = Object.keys(params || {}).map(function (name) {
      return encodeURIComponent(name) + "=" + encodeURIComponent(String(params[name]));
    }).join("&");
    var url = "https://api.themoviedb.org/3" + path + "?api_key=" + encodeURIComponent(key) + (query ? "&" + query : "");
    return __xuperFetch(url, { timeoutMs: 8000 }).then(function (response) {
      if (!response.ok) throw new Error("TMDB " + response.status);
      return response.json();
    });
  },
  rank: {
    shortQuery: function (value) { return String(value); },
    filterRelevant: function (items) { return items; },
    sortBySimilarity: function (items) { return items; }
  },
  seed: function () { return false; }
};
globalThis.kino = kino;

// src/crypto.js
var toHex = (s) => Array.from(new TextEncoder().encode(s), (b) => b.toString(16).padStart(2, "0")).join("");
var HEX_CHUNK = 65536;
var NOT_LOWER_HEX = /[^0-9a-f]/;
var NOT_ASCII = /[^\x00-\x7f]/;
var PAIR = /../g;
function fromHex(h) {
  if (typeof h !== "string" || h.length === 0 || h.length % 2 !== 0) throw new Error("not hex");
  const parts = [];
  for (let i = 0; i < h.length; i += HEX_CHUNK) {
    const piece = h.slice(i, i + HEX_CHUNK);
    if (NOT_LOWER_HEX.test(piece)) throw new Error("not hex");
    const text2 = decodeURIComponent(piece.replace(PAIR, "%$&"));
    if (NOT_ASCII.test(text2)) throw new Error("not ascii");
    parts.push(text2);
  }
  return parts.join("");
}
var PASS_KEY = "kino-xuper-hex16";
var HOST_CHUNK = 4e6;
function hostFromHex(kino2, h) {
  if (typeof h !== "string" || h.length === 0 || h.length % 2 !== 0) throw new Error("not hex");
  const parts = [];
  for (let i = 0; i < h.length; i += HOST_CHUNK) {
    const piece = h.slice(i, i + HOST_CHUNK);
    const sealed = kino2.crypto.encrypt("aes-128-ecb", { key: PASS_KEY, data: piece, inputEncoding: "hex" });
    const text2 = kino2.crypto.decrypt("aes-128-ecb", { key: PASS_KEY, data: sealed });
    if (typeof text2 !== "string" || text2.length * 2 !== piece.length) throw new Error("not ascii");
    parts.push(text2);
  }
  return parts.join("");
}
function wireText(kino2, h) {
  let text2 = null;
  try {
    text2 = hostFromHex(kino2, h);
  } catch (_) {
  }
  return text2 === null ? { text: fromHex(h), how: "engine" } : { text: text2, how: "host" };
}
function makeCrypto(kino2, { onDecode = null } = {}) {
  const fail = (what) => kino2.error("unavailable", "el portal no se pudo " + what);
  return {
    encryptBody(plain3) {
      try {
        const b64 = kino2.crypto.encrypt("des-ede3-ecb", {
          key: kino2.secret("magisKey"),
          data: plain3,
          padding: "pkcs7"
        });
        if (typeof b64 !== "string" || b64 === "") throw new Error("empty");
        return toHex(b64);
      } catch (_) {
        throw fail("cifrar");
      }
    },
    // `onDecode({ how, bytes, ms })`, optional: which way a wire was decoded and how long it took.
    decryptBlob(wire) {
      try {
        const startedAt = Date.now();
        const { text: b64, how } = wireText(kino2, wire);
        if (onDecode) onDecode({ how, bytes: wire.length, ms: Date.now() - startedAt });
        const text2 = kino2.crypto.decrypt("des-ede3-ecb", {
          key: kino2.secret("magisKey"),
          data: b64,
          padding: "pkcs7"
        });
        if (typeof text2 !== "string" || text2 === "") throw new Error("empty");
        return text2;
      } catch (_) {
        throw fail("descifrar");
      }
    }
  };
}

// src/config.js
var hosts = ["osuhk.m3x8o50te.com", "oogoy.f30c96w8.com"];
var APP_ID = "com.android.msandroid";
var APK_VERSION = "49902";
var PORTAL_CODE = "masnew";
var SPKG_VER = "2025-08-07 05:40:11_36_16_";
var APK_VER_HEADER = "43404";
var USER_AGENT = "okhttp/3.12.12";
var UA_CDN = "Ranger/4.9.4-17294ac0";
var LIVE_USER_AGENT = "Ranger/4.9.4-17294ac0";
var LIVE_APP = "com.android.msandroid";
var LIVE_APP_VERSION = "49902";
var LIVE_X_BUFFER = "0";
var CONTENT_TYPE = "application/json;charset=utf-8";
var RATE_LIMIT_MS = 400;
var REQUEST_TIMEOUT_MS = 25e3;
var DEVICE_FIXED = Object.freeze({
  loginType: "2",
  appLanguage: "en",
  hardwareInfo: "ranchu",
  model: "sdk_gphone64_arm64",
  product: "sdk_gphone64_arm64",
  cpu: "arm64-v8a",
  B29: "",
  reserve1: "",
  deviceToken: "",
  drmId: "",
  sdkVer: 36
});
var SNTOKEN_SALT = "ntFT65w6itH!lHCPw7D=@qnsFC5adD28";
var PASSWORD_SALT = "cloudstream";
var FIXED_MAC = "02:00:00:00:00:00";
var FINGERPRINT_FIXED = Object.freeze({
  board: "goldfish_arm64",
  brand: "google",
  cpuAbi: "arm64-v8a",
  device: "emu64a",
  diskInfo: "8GB",
  display: "sdk_gphone64_arm64",
  fingerprint: "google/sdk_gphone64_arm64/emu64a:14/UE1A.230829.036/11228894:user/release-keys",
  hardware: "ranchu",
  host: "abfarm",
  manufacturer: "Google",
  ramSize: "4GB",
  romSize: "8GB",
  tags: "release-keys",
  verId: ""
});
var SHARED_EMAIL = "kinoplayer@outlook.es";
var SHARED_PASSWORD = "Cris2337677";

// src/util.js
var isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
var asText = (v) => v === null || v === void 0 ? "" : typeof v === "string" ? v : String(v);
var optStringStrict = (v) => typeof v === "string" ? v : typeof v === "number" ? String(v) : "";
var isBlank = (s) => typeof s !== "string" || s.trim() === "";
var notBlank = (s) => s.trim() !== "";
var objects = (v) => Array.isArray(v) ? v.filter(isObject) : [];
var isKinoError = (e) => e !== null && typeof e === "object" && typeof e.name === "string" && e.name.startsWith("KinoError_");
var INT = /^[+-]?\d+$/;
function intOrNull(v) {
  if (v === null || v === void 0) return null;
  const s = String(v);
  if (!INT.test(s)) return null;
  const n = Number(s);
  return n >= -2147483648 && n <= 2147483647 ? n : null;
}
var SAVES_BEFORE_ACTION = [0, 9, 63];
function savesBeforeAction(kino2) {
  let version = "";
  try {
    version = kino2 && typeof kino2.appVersion === "string" ? kino2.appVersion.trim() : "";
  } catch (_) {
    return false;
  }
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(version);
  if (!m) return false;
  for (let i = 0; i < 3; i++) {
    const n = Number(m[i + 1]);
    if (n !== SAVES_BEFORE_ACTION[i]) return n > SAVES_BEFORE_ACTION[i];
  }
  return true;
}
function configuredPair(config) {
  const t = (k) => asText(config.get(k)).trim();
  const own = { email: t("email"), password: t("password") };
  if (own.email !== "" && own.password !== "") return own;
  const created = { email: t("regEmail"), password: t("regPassword") };
  if (created.email !== "" && created.password !== "") return created;
  return own;
}
function creationFields(config) {
  const t = (k) => asText(config.get(k)).trim();
  return { email: t("regEmail") || t("email"), password: t("regPassword") || t("password") };
}

// src/trace.js
var MAX_LINE_CHARS = 160;
var NAME = /^[a-z][a-z0-9_-]{0,19}$/;
var KEY = /^[a-z][a-zA-Z0-9]{0,11}$/;
var SENSITIVE_KEY = /pass|token|secret|cred|auth|bearer|cookie|session|key|mail|host|url|^sn$|user|license|sign/i;
var VALUE = /^[A-Za-z0-9_\/-]{1,20}$/;
var ID_SHAPED = /[0-9a-fA-F]{12}|[0-9]{10}/;
var APP_BLOB_CHARS = 24;
var APP_LONG_TOKEN = /(?=[A-Za-z0-9_-]*\d)[A-Za-z0-9_-]{16,}/;
function word(v) {
  let s;
  if (typeof v === "number") s = Number.isFinite(v) ? String(Math.round(v)) : "?";
  else if (typeof v === "boolean") return v ? "1" : "0";
  else s = typeof v === "string" ? v : "";
  return VALUE.test(s) && !ID_SHAPED.test(s) ? s : "?";
}
function field(k, v) {
  const w = word(v);
  return k.length + 1 + w.length >= APP_BLOB_CHARS || APP_LONG_TOKEN.test(w) ? `${k}=?` : `${k}=${w}`;
}
function lineOf(area, event, fields) {
  const parts = [`xuper:${NAME.test(area) ? area : "?"}`, NAME.test(event) ? event : "?"];
  if (fields !== null && typeof fields === "object") {
    for (const [k, v] of Object.entries(fields)) {
      if (v === void 0 || v === null || !KEY.test(k) || SENSITIVE_KEY.test(k)) continue;
      parts.push(field(k, v));
    }
  }
  return parts.join(" ").slice(0, MAX_LINE_CHARS);
}
function trace(kino2, area, event, fields = {}) {
  try {
    kino2.log(lineOf(area, event, fields));
  } catch (_) {
  }
}
function report(kino2, area, event, fields = {}) {
  try {
    const line = lineOf(area, event, fields);
    if (kino2.log && typeof kino2.log.report === "function") kino2.log.report(line);
    else kino2.log(line);
  } catch (_) {
  }
}
var PERF_AREAS = Object.freeze({ slow: "perf_slow", timeout: "perf_timeout", cold: "perf_cold", store: "perf_store", decode: "perf_decode" });
var SLOW_CALL_MS = 8e3;
var TIMEOUT_CALL_MS = 2e4;
var PERF_REPORT_MS = 2e3;
function reportIfSlow(kino2, area, event, ms, fields = {}) {
  if (ms >= PERF_REPORT_MS) report(kino2, area, event, fields);
  else trace(kino2, area, event, fields);
}
function msBucket(ms) {
  const s = Number.isFinite(ms) ? ms / 1e3 : 0;
  const edges = [[1, "lt1s"], [2, "1-2s"], [4, "2-4s"], [8, "4-8s"], [12, "8-12s"], [16, "12-16s"], [20, "16-20s"], [30, "20-30s"], [60, "30-60s"]];
  for (const [limit, word2] of edges) if (s < limit) return word2;
  return "ge60s";
}
function kbBucket(bytes) {
  const kb = Number.isFinite(bytes) ? bytes / 1024 : 0;
  const edges = [[256, "lt256k"], [512, "256-512k"], [1024, "512k-1m"], [2048, "1-2m"], [4096, "2-4m"]];
  for (const [limit, word2] of edges) if (kb < limit) return word2;
  return "ge4m";
}
function reportCallTime(kino2, fn, ms, ok, more = {}) {
  if (!(ms >= SLOW_CALL_MS)) return;
  report(kino2, ms >= TIMEOUT_CALL_MS ? PERF_AREAS.timeout : PERF_AREAS.slow, "call", { fn, b: msBucket(ms), ok, ...more });
}
function makeDecodeReporter(kino2) {
  let done = false;
  return ({ how, bytes, ms }) => {
    if (done || !(bytes >= 1e6)) return;
    done = true;
    reportIfSlow(kino2, PERF_AREAS.decode, "wire", ms, { how, kb: kbBucket(bytes), b: msBucket(ms) });
  };
}
function errCode(e) {
  if (e === null || typeof e !== "object") return "error";
  const name = typeof e.name === "string" ? e.name : "";
  let c = "";
  if (name === "PortalError" && typeof e.code === "string") c = e.code;
  else if (name.startsWith("KinoError_")) c = name.slice("KinoError_".length);
  else c = name;
  return VALUE.test(c) ? c : "error";
}
async function traced(kino2, clock2, fn, body, extra = {}, late = null) {
  const t0 = clock2.now();
  trace(kino2, "call", "start", { fn, ...extra });
  const lateFields = () => {
    if (typeof late !== "function") return {};
    try {
      const f = late();
      return f !== null && typeof f === "object" ? f : {};
    } catch (_) {
      return {};
    }
  };
  let out;
  try {
    out = await body();
  } catch (e) {
    const ms2 = clock2.now() - t0;
    const more2 = lateFields();
    trace(kino2, "call", "fail", { fn, ...extra, code: errCode(e), ms: ms2, ...more2 });
    reportCallTime(kino2, fn, ms2, false, more2);
    throw e;
  }
  const ms = clock2.now() - t0;
  const more = lateFields();
  trace(kino2, "call", "ok", { fn, ...extra, ms, n: Array.isArray(out) ? out.length : void 0, ...more });
  reportCallTime(kino2, fn, ms, true, more);
  return out;
}
function seedTag(kino2, sn) {
  try {
    if (typeof sn !== "string" || sn === "") return "?";
    return String(kino2.crypto.hash("sha256", "xuper-seed\n" + sn)).slice(0, 8);
  } catch (_) {
    return "?";
  }
}

// src/i18n.js
function isEnglish(kino2) {
  try {
    const lang = kino2 && typeof kino2.lang === "string" ? kino2.lang.trim().toLowerCase() : "";
    return lang === "en" || lang.startsWith("en-") || lang.startsWith("en_");
  } catch (_) {
    return false;
  }
}
function isSpanish(kino2) {
  try {
    const lang = kino2 && typeof kino2.lang === "string" ? kino2.lang.trim().toLowerCase() : "";
    return lang.startsWith("es");
  } catch (_) {
    return false;
  }
}
var GENRES_ES = Object.freeze({
  "Action": "Acci\xF3n",
  "Adventure": "Aventura",
  "Animation": "Animaci\xF3n",
  "Biography": "Biograf\xEDa",
  "Comedy": "Comedia",
  "Crime": "Crimen",
  "Documentary": "Documental",
  "Drama": "Drama",
  "Family": "Familia",
  "Fantasy": "Fantas\xEDa",
  "History": "Historia",
  "Horror": "Terror",
  "Music": "M\xFAsica",
  "Musical": "Musical",
  "Mystery": "Misterio",
  "Romance": "Romance",
  "Sci-Fi": "Ciencia ficci\xF3n",
  "Sport": "Deportes",
  "Thriller": "Suspenso",
  "War": "Guerra",
  "Western": "Western",
  "Reality-TV": "Reality",
  "Talk-Show": "Programa de entrevistas",
  "Game-Show": "Concurso",
  "News": "Noticias",
  "Film-Noir": "Cine negro",
  "Short": "Cortometraje",
  "Adult": "Adultos"
});
function genreName(name, spanish) {
  if (!spanish || typeof name !== "string") return name;
  const key = name.trim();
  return Object.hasOwn(GENRES_ES, key) ? GENRES_ES[key] : name;
}
var TEXTS = Object.freeze({
  // Where the plugin's own settings live in Kino.
  settingsPlace: ["Ajustes \u25B8 Xuper", "Settings \u25B8 Xuper"],
  // Errors the person reads (`userMessage`).
  accountSessionLost: [
    "Tu sesi\xF3n de Xuper se cerr\xF3 y no pudimos volver a entrar con tu cuenta. Vuelve a vincularla en {place}.",
    "Your Xuper session ended and we could not sign back in with your account. Link it again in {place}."
  ],
  accountInUseElsewhere: [
    "Tu cuenta de Xuper se abri\xF3 en otro dispositivo, y solo puede usarse en uno a la vez. Vuelve a intentarlo, o vinc\xFAlala de nuevo en {place}.",
    "Your Xuper account was opened on another device, and it can only be used on one at a time. Try again, or link it again in {place}."
  ],
  episodeGone: ["Este cap\xEDtulo ya no est\xE1 disponible.", "This episode is no longer available."],
  seriesGone: ["Esta serie ya no est\xE1 disponible.", "This series is no longer available."],
  portalSlow: [
    "Xuper no responde en este momento; intenta de nuevo en unos minutos.",
    "Xuper is not responding right now; try again in a few minutes."
  ],
  liveNeedsAccount: [
    "Este canal necesita una cuenta de Xuper (para pel\xEDculas y series no hace falta). Vinc\xFAlala en {place}.",
    "This channel needs a Xuper account (movies and series do not). Link it in {place}."
  ],
  sendCodeFailed: [
    "Xuper no pudo enviar el c\xF3digo a ese correo. Revisa que est\xE9 bien escrito en {place}.",
    "Xuper could not send the code to that email. Check that it is spelled right in {place}."
  ],
  regionBlocked: [
    "Xuper no permite esta acci\xF3n desde tu regi\xF3n o tu red (a veces es una VPN). Prueba con otra conexi\xF3n.",
    "Xuper does not allow this from your region or network (sometimes a VPN). Try another connection."
  ],
  cryptoUnavailable: [
    "Este aparato no pudo abrir la conexi\xF3n segura con Xuper. Actualiza la aplicaci\xF3n; si sigue igual, el aparato no es compatible.",
    "This device could not open the secure connection with Xuper. Update the app; if it stays the same, the device is not supported."
  ],
  requestNotSaved: [
    "No pudimos guardar tu pedido. Vuelve a tocar Crear cuenta.",
    "We could not save your request. Tap Create account again."
  ],
  codeRefused: [
    "Xuper no acept\xF3 el c\xF3digo, o ese correo ya tiene cuenta. Pide otro c\xF3digo o toca Iniciar sesi\xF3n.",
    "Xuper did not accept the code, or that email already has an account. Ask for another code or tap Sign in."
  ],
  fillAccount: ["Faltan los datos de tu cuenta: compl\xE9talos en {place}.", "Your account details are missing: fill them in {place}."],
  accountRefused: ["Xuper no acept\xF3 esa cuenta. Revisa los datos en {place}.", "Xuper did not accept that account. Check the details in {place}."],
  fillEmail: ["Escribe tu correo en {place}.", "Enter your email in {place}."],
  // Older Kino runs a button on what was saved, so the person is told to save first (see savesBeforeAction).
  fillEmailSave: ["Escribe tu correo en {place} y pulsa Guardar antes de tocar el bot\xF3n.", "Enter your email in {place} and tap Save before pressing the button."],
  badEmail: ["Escribe un correo v\xE1lido en {place}.", "Enter a valid email in {place}."],
  fillCode: ["Escribe el c\xF3digo que te enviamos en {place}.", "Enter the code we sent you in {place}."],
  askCodeAgain: ["Pide el c\xF3digo otra vez.", "Ask for the code again."],
  // The settings form: status line, action results, field errors.
  statusConnecting: ["Conectando con {who}\u2026 Mientras tanto, sesi\xF3n an\xF3nima", "Connecting to {who}\u2026 Anonymous session meanwhile"],
  whoShared: ["la cuenta compartida", "the shared account"],
  whoOwn: ["tu cuenta", "your account"],
  statusSharedBroken: ["La cuenta compartida ya no funciona: sesi\xF3n an\xF3nima", "The shared account no longer works: anonymous session"],
  statusOwnRefused: [
    "No se pudo iniciar sesi\xF3n con tu cuenta: sesi\xF3n an\xF3nima. Revisa tu correo y contrase\xF1a",
    "Could not sign in with your account: anonymous session. Check your email and password"
  ],
  statusAnonymous: ["Sin cuenta: sesi\xF3n an\xF3nima", "No account: anonymous session"],
  statusShared: ["Cuenta compartida", "Shared account"],
  statusConnectedAs: ["Conectado como {email}", "Signed in as {email}"],
  statusBlockedSeeds: ["Zona bloqueada: {n} semillas cargadas", "Blocked region: {n} seeds loaded"],
  statusBlockedNoSeeds: ["Zona bloqueada: sin semillas cargadas", "Blocked region: no seeds loaded"],
  seedsBanner: [
    "Por ahora no hay sesiones disponibles para tu zona; vuelve a intentar en un rato o toca Actualizar semillas",
    "There are no sessions for your region right now; try again in a while or tap Update seeds"
  ],
  statusAutoRefreshOff: ["Actualizaci\xF3n autom\xE1tica desactivada", "Automatic update turned off"],
  statusUnknown: ["No se pudo consultar el estado", "Could not check the status"],
  signedIn: ["Sesi\xF3n iniciada", "Signed in"],
  signedOut: ["Sesi\xF3n cerrada", "Signed out"],
  seedSwitched: ["Semilla cambiada (intento {n})", "Seed changed (attempt {n})"],
  offlineRetry: ["Sin conexi\xF3n, reintenta", "No connection, try again"],
  accountNoSeeds: ["Tu cuenta no usa semillas", "Your account does not use seeds"],
  noOtherSeed: ["No hay otra semilla para probar", "There is no other seed to try"],
  seedsAllFailed: ["Prob\xE9 {n} semillas y ninguna funcion\xF3", "I tried {n} seeds and none worked"],
  seedsLoaded: ["{n} semillas cargadas", "{n} seeds loaded"],
  codeAlreadySent: ["Ya te enviamos un c\xF3digo; espera un minuto antes de pedir otro", "We already sent you a code; wait a minute before asking for another"],
  codeSent: ["Te enviamos un c\xF3digo a {email}", "We sent a code to {email}"],
  codeSentSave: ["Te enviamos un c\xF3digo a {email}. Si es otro correo, pulsa Guardar y vuelve a tocar el bot\xF3n.", "We sent a code to {email}. If that is not the one, tap Save and press the button again."],
  accountCreatedSignIn: ["Cuenta creada. Toca Iniciar sesi\xF3n para entrar.", "Account created. Tap Sign in to enter."],
  accountCreatedSignedIn: ["Cuenta creada y sesi\xF3n iniciada", "Account created and signed in"],
  sharedActivationFailed: ["No se pudo activar la cuenta compartida", "Could not turn on the shared account"],
  removeAccountOrShared: ["Quita tu cuenta o apaga la cuenta compartida", "Remove your account or turn off the shared account"],
  enterEmail: ["Escribe tu correo", "Enter your email"],
  enterValidEmail: ["Escribe un correo v\xE1lido", "Enter a valid email"],
  credentialsRefused: ["Credenciales de Xuper inv\xE1lidas", "Xuper did not accept these sign-in details"],
  // Labels and titles the plugin makes (rows, tabs, chapters, copies).
  newBadge: ["NUEVO", "NEW"],
  liveChannelsRow: ["Canales en vivo", "Live channels"],
  allChannels: ["Todos", "All"],
  // Categorías tiles of live channels, one per genre (liveTiles.js).
  liveTileSports: ["Deportes en vivo", "Live sports"],
  liveTileNews: ["Noticias en vivo", "Live news"],
  liveTileKids: ["Infantil en vivo", "Live kids"],
  liveTileMovies: ["Cine en vivo", "Live movies"],
  liveTileSeries: ["Series en vivo", "Live series"],
  liveTileMoviesSeries: ["Cine y series en vivo", "Live movies & series"],
  liveTileEntertainment: ["Entretenimiento en vivo", "Live entertainment"],
  liveTileMusic: ["M\xFAsica en vivo", "Live music"],
  liveTileDocumentaries: ["Documentales en vivo", "Live documentaries"],
  liveTileAnime: ["Anime en vivo", "Live anime"],
  chapterN: ["Cap\xEDtulo {n}", "Episode {n}"],
  seasonN: ["Temporada {n}", "Season {n}"],
  server: ["Servidor {n}", "Server {n}"],
  backup: ["respaldo", "backup"],
  retry: ["reintento {n}", "retry {n}"],
  versionN: ["Versi\xF3n {n}", "Version {n}"]
});
function say(kino2, key, vars = {}) {
  const pair = TEXTS[key];
  if (!pair) return key;
  const en = isEnglish(kino2);
  const all = { place: TEXTS.settingsPlace[en ? 1 : 0], ...vars };
  return pair[en ? 1 : 0].replace(/\{(\w+)\}/g, (m, name) => Object.hasOwn(all, name) ? String(all[name]) : m);
}
function sayAll(key) {
  const pair = TEXTS[key];
  if (!pair) return [];
  return pair.map((text2, i) => text2.replace(/\{place\}/g, TEXTS.settingsPlace[i]));
}

// src/portal.js
var MAX_SLEEP_MS = 5e3;
var MAX_REQUEST_MS = 3e4;
var CONTACT_FAILED = "No se pudo contactar a Xuper; intenta de nuevo en un momento";
var PortalError = class extends Error {
  constructor(code, message) {
    super(message || code);
    this.name = "PortalError";
    this.code = code;
    this.message = message || code;
  }
};
var SETTINGS_PLACE = sayAll("settingsPlace")[0];
var ACCOUNT_SESSION_LOST = sayAll("accountSessionLost")[0];
var ACCOUNT_IN_USE_ELSEWHERE_TEXT = sayAll("accountInUseElsewhere")[0];
var ACCOUNT_SENTENCES = /* @__PURE__ */ new Set([...sayAll("accountSessionLost"), ...sayAll("accountInUseElsewhere")]);
var ACCOUNT_IN_USE_ELSEWHERE = "aaa100083";
var SESSION_DEAD_CODES = /* @__PURE__ */ new Set(["aaa100027", "aaa100028"]);
function accountProblemMessage(code, kino2 = null) {
  if (SESSION_DEAD_CODES.has(code)) return say(kino2, "accountSessionLost");
  if (code === ACCOUNT_IN_USE_ELSEWHERE) return say(kino2, "accountInUseElsewhere");
  return null;
}
var EPISODE_GONE = sayAll("episodeGone")[0];
var SERIES_GONE = sayAll("seriesGone")[0];
var isEpisodeGone = (text2) => sayAll("episodeGone").includes(text2);
var told = (kino2, code, message, sentence) => kino2.error(code, message, { userMessage: sentence });
function namedCause(kino2, e) {
  if (e instanceof PortalError && e.code === "portal100024") return told(kino2, "unavailable", "region blocked (portal100024)", say(kino2, "regionBlocked"));
  const msg = e !== null && typeof e === "object" && typeof e.message === "string" ? e.message : "";
  if (/el portal no se pudo (cifrar|descifrar)/.test(msg)) return told(kino2, "unavailable", msg, say(kino2, "cryptoUnavailable"));
  return null;
}
var GENERIC = "Xuper no est\xE1 disponible ahora";
var PORTAL_SLOW = sayAll("portalSlow")[0];
function slowPortal(kino2, e) {
  if (!e || e.name !== "KinoError_unavailable" || typeof e.userMessage === "string") return e;
  return kino2.error("unavailable", typeof e.message === "string" && e.message !== "" ? e.message : GENERIC, { userMessage: say(kino2, "portalSlow") });
}
function mapPortalError(code, message, kino2, { accountLinked = false, sharedAccount = false, goneMessage = EPISODE_GONE } = {}) {
  const msg = typeof message === "string" ? message : "";
  const accountText = accountLinked ? accountProblemMessage(code, kino2) : null;
  if (accountText) return told(kino2, "auth_required", `cuenta propia: ${code}`, accountText);
  if (code === "portal100006") {
    const series = sayAll("seriesGone").includes(goneMessage);
    return told(kino2, "not_found", `portal100006: ${series ? "serie" : "cap\xEDtulo"} borrado`, say(kino2, series ? "seriesGone" : "episodeGone"));
  }
  if (code === "portal100004" || msg.includes("\u4E0D\u5B58\u5728")) {
    return kino2.error("not_found", "No se encontr\xF3 en Xuper");
  }
  if (code === "portal100024") {
    return kino2.error("geo_blocked", "Este contenido no est\xE1 disponible en tu regi\xF3n");
  }
  if (sharedAccount && (SESSION_DEAD_CODES.has(code) || code === ACCOUNT_IN_USE_ELSEWHERE)) {
    return kino2.error("unavailable", `${GENERIC} (shared session: ${code})`);
  }
  if (SESSION_DEAD_CODES.has(code)) {
    return kino2.error("auth_required", "Configura Xuper en Ajustes \u25B8 Plugins");
  }
  return kino2.error("unavailable", GENERIC);
}
var CALL_BUDGET_MS = {
  home: 2e4,
  browse: 2e4,
  episodes: 2e4,
  resolve: 2e4,
  search: 15e3,
  liveCategories: 2e4,
  liveChannels: 2e4,
  liveSearch: 30e3,
  section: 2e4,
  categories: 2e4
};
var BUDGET_MARGIN_MS = 2e3;
var callDeadline = (clock2, budgetMs) => clock2.now() + budgetMs - BUDGET_MARGIN_MS;
var viewOpts = ({ userId, userToken, sn, deadline }) => ({
  baseFields: true,
  userId,
  userToken,
  ...typeof sn === "string" && sn !== "" ? { sn } : {},
  ...typeof deadline === "number" ? { deadline } : {}
});
function shapeOf(s) {
  if (typeof s !== "string") return "none";
  if (s === "") return "empty";
  const first = s.charCodeAt(0);
  if (first === 31) return "gzip";
  const t = s.trimStart();
  if (t === "") return "blank";
  if (t[0] === "<") return "html";
  if (t[0] === "{" || t[0] === "[") return "json";
  let hex = true, upperHex = false, b64 = true, wrapped = false;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    const digit = c >= 48 && c <= 57, lower = c >= 97 && c <= 122, upper = c >= 65 && c <= 90;
    const newline = c === 10 || c === 13;
    if (newline) wrapped = true;
    if (!(digit || c >= 97 && c <= 102)) {
      if (c >= 65 && c <= 70) upperHex = true;
      else hex = false;
    }
    if (!(digit || lower || upper || c === 43 || c === 47 || c === 61 || c === 45 || c === 95 || newline)) b64 = false;
    if (!hex && !b64) return "text";
  }
  if (hex) return (upperHex ? "hex-upper" : "hex") + (s.length % 2 === 0 ? "" : "-odd");
  return wrapped ? "b64-ws" : "b64";
}
function contentClass(res) {
  const h = res !== null && typeof res === "object" && res.headers !== null && typeof res.headers === "object" ? res.headers : null;
  const ct = h && typeof h["content-type"] === "string" ? h["content-type"].toLowerCase() : "";
  if (ct === "") return "none";
  if (ct.includes("json")) return "json";
  if (ct.includes("html")) return "html";
  if (ct.startsWith("text/")) return "text";
  return "other";
}
function gzipped(res, text2) {
  const h = res !== null && typeof res === "object" && res.headers !== null && typeof res.headers === "object" ? res.headers : null;
  const enc = h && typeof h["content-encoding"] === "string" ? h["content-encoding"].toLowerCase() : "";
  return enc.includes("gzip") || typeof text2 === "string" && text2.charCodeAt(0) === 31;
}
var PATH_ALIASES = { "v2/sendEmailVerifyCode": "v2/sendCode", "v2/validateVerifyCode": "v2/checkCode" };
var tracePath = (path) => Object.hasOwn(PATH_ALIASES, path) ? PATH_ALIASES[path] : path;
var HOST_KEY = "portalHost";
var HOST_MEMORY_MS = 7 * 24 * 36e5;
function makePortal({ kino: kino2, crypto, config, clock: clock2, snProvider, modeOf = () => "?" }) {
  const listed = (h) => typeof h === "string" && (config.hosts || []).includes(h);
  let storedHost = null;
  try {
    const h = kino2.storage.get(HOST_KEY);
    if (listed(h)) storedHost = h;
  } catch (_) {
  }
  let preferredHost = storedHost;
  const remember = (host) => {
    preferredHost = host;
    if (host === storedHost || storedHost === null && host === (config.hosts || [])[0]) return;
    storedHost = host;
    try {
      kino2.storage.set(HOST_KEY, host, { ttlMs: HOST_MEMORY_MS });
    } catch (_) {
    }
  };
  let lastCallMs = null;
  const decryptFails = /* @__PURE__ */ new Map();
  const hostOrder = () => {
    const hosts2 = config.hosts || [];
    if (preferredHost === null) return hosts2;
    return [preferredHost, ...hosts2.filter((h) => h !== preferredHost)];
  };
  let slotTail = Promise.resolve();
  function waitTurn() {
    const run = slotTail.then(async () => {
      const now = clock2.now();
      if (lastCallMs !== null) {
        const wait = Math.min(MAX_SLEEP_MS, Math.ceil(RATE_LIMIT_MS - (now - lastCallMs)));
        if (wait > 0) await kino2.sleep(wait);
      }
      lastCallMs = clock2.now();
    });
    slotTail = run.then(() => {
    }, () => {
    });
    return run;
  }
  function deviceDict(sn) {
    return {
      ...DEVICE_FIXED,
      apkVersion: config.apkVersion,
      sysVersion: SPKG_VER,
      appId: config.appId,
      sn: sn ?? snProvider()
    };
  }
  async function call(path, bean = {}, opts = {}) {
    const { baseFields = true, userId = "", userToken = "", sn = null, timeoutMs, deadline, onFetchMs } = opts;
    const requested = Math.trunc(Number(timeoutMs));
    const perRequest = Number.isFinite(requested) && requested > 0 ? Math.min(requested, MAX_REQUEST_MS) : REQUEST_TIMEOUT_MS;
    const tp = tracePath(path);
    const body = {
      ...baseFields ? { portalCode: PORTAL_CODE, userId, userToken } : {},
      ...bean,
      ...deviceDict(sn)
    };
    const wire = crypto.encryptBody(JSON.stringify(body));
    const headers = {
      apk: config.appId,
      apkVer: APK_VER_HEADER,
      spkgVer: SPKG_VER,
      "User-Agent": USER_AGENT,
      "Content-Type": CONTENT_TYPE
    };
    const outOfTime = () => typeof deadline === "number" && Math.floor(deadline - clock2.now()) < 1;
    if (outOfTime()) {
      trace(kino2, "portal", "deadline", { path: tp });
      throw kino2.error("unavailable", CONTACT_FAILED);
    }
    await waitTurn();
    let lastError = null;
    const order = hostOrder();
    for (let i = 0; i < order.length; i++) {
      const host = order[i];
      let requestMs = perRequest;
      if (typeof deadline === "number") {
        const left = Math.floor(deadline - clock2.now());
        if (left < 1) {
          trace(kino2, "portal", "deadline", { path: tp, i });
          break;
        }
        const remaining = order.length - i;
        requestMs = Math.min(perRequest, remaining > 1 ? Math.ceil(left / remaining) : left);
      }
      let answer;
      let stage = "fetch";
      let res = null, bodyText = null;
      try {
        const sentAt = clock2.now();
        res = await kino2.fetch(`https://${host}/api/portalCore/${path}`, {
          method: "POST",
          headers,
          body: wire,
          cookies: false,
          timeoutMs: requestMs
        });
        if (typeof onFetchMs === "function") {
          try {
            onFetchMs(clock2.now() - sentAt);
          } catch (_) {
          }
        }
        stage = "body";
        bodyText = res.text();
        answer = JSON.parse(bodyText);
        if (!isObject(answer)) throw new Error("respuesta del portal no es un objeto");
        if (i > 0) report(kino2, "portal", "failover", { path: tp, to: i });
        remember(host);
        const rc = answer.returnCode;
        const code = rc === void 0 || rc === null ? "" : String(rc);
        if (code !== "" && code !== "0") {
          const em = answer.errorMessage;
          answer = { portalFailure: new PortalError(code, typeof em === "string" && em.trim() ? em : "") };
        } else if (typeof answer.data === "string" && answer.data !== "") {
          stage = "data";
          const plain3 = crypto.decryptBlob(answer.data);
          stage = "inner";
          const inner = JSON.parse(plain3);
          if (!isObject(inner)) throw new Error("datos del portal no son un objeto");
          answer = { ok: inner };
        } else if (isObject(answer.data)) {
          answer = { ok: answer.data };
        } else if (answer.data === void 0 || answer.data === null || answer.data === "") {
          answer = { ok: answer };
        } else {
          stage = "data";
          throw new Error("datos del portal de un tipo inesperado");
        }
      } catch (e) {
        lastError = e;
        if (stage === "fetch") trace(kino2, "portal", "host_fail", { path: tp, i, why: errCode(e) });
        else decryptFail(path, i, stage, res, bodyText, answer, e);
        continue;
      }
      decryptFails.delete(path);
      if (answer.portalFailure) {
        trace(kino2, "portal", "rc", { path: tp, code: answer.portalFailure.code });
        throw answer.portalFailure;
      }
      return answer.ok;
    }
    if (order.length > 0) trace(kino2, "portal", "all_fail", { path: tp, n: order.length });
    throw kino2.error("unavailable", order.length === 0 ? "sin hosts configurados" : CONTACT_FAILED);
  }
  function decryptFail(path, i, at, res, bodyText, answer, e) {
    try {
      const attempt = (decryptFails.get(path) || 0) + 1;
      decryptFails.set(path, attempt);
      const data = at === "body" || !isObject(answer) ? void 0 : answer.data;
      let mode = "?";
      try {
        mode = String(modeOf());
      } catch (_) {
      }
      trace(kino2, "portal", "decrypt-fail", {
        path: tracePath(path),
        i,
        at,
        status: res !== null && typeof res === "object" && typeof res.status === "number" ? res.status : -1,
        ctype: contentClass(res),
        len: typeof bodyText === "string" ? bodyText.length : -1,
        shape: shapeOf(at === "body" ? bodyText : data),
        dlen: typeof data === "string" ? data.length : -1,
        gzip: gzipped(res, bodyText),
        sess: mode,
        attempt,
        why: errCode(e)
      });
    } catch (_) {
    }
  }
  return { call };
}

// src/device.js
var str = (v) => typeof v === "string" ? v : v === null || v === void 0 ? "" : String(v);
var blank = (v) => str(v).trim() === "";
var activateBean = (snToken) => ({
  snToken,
  authVersion: "",
  authCode: "",
  preCode: "",
  macAddr: FIXED_MAC,
  reserve1: "",
  openNum: 4,
  channel: "default",
  matadata: "",
  signdata: ""
});
function makeFingerprint(kino2) {
  const randomHex = (bytes) => kino2.crypto.randomBytes(bytes, "hex");
  const randomMac = () => randomHex(6).match(/../g).join(":");
  return () => ({
    ...FINGERPRINT_FIXED,
    androidId: randomHex(8),
    cpuId: randomHex(8),
    serialNumber: randomHex(8),
    etheMac: randomMac(),
    gatewayMac: randomMac(),
    wifiMac: randomMac()
  });
}
var snFrom = (kino2, j, snToken) => (blank(j.sn) ? kino2.crypto.hash("md5", snToken + SNTOKEN_SALT) : str(j.sn)).toLowerCase();

// src/session.js
var DEFAULT_SEEDS_URL = "https://raw.githubusercontent.com/xuper-plugin/kino-plugin-xuper/seeds/seeds.json";
var INVALID_SN = /* @__PURE__ */ new Set(["aaa100080", "aaa100082"]);
var SESSION_DEAD = /* @__PURE__ */ new Set(["aaa100027", "aaa100028"]);
var GEO_BLOCKED = "portal100024";
var SEED_RESCUE_ROUNDS = 3;
var SEED_SWITCH_TRIES = 5;
var POOL_REFRESH_COOLDOWN_MS = 1e4;
var FAILED_REFRESH_COOLDOWN_MS = 3e4;
var BLOCKED_REFRESH_MS = 5e3;
var MIN_REQUEST_MS = 1e3;
var PERIODIC_REFRESH_MS = 3 * 36e5;
var PERIODIC_TIMEOUT_MS = 5e3;
var MAX_SEEDS = 200;
var SEED_MIN_LIFE_MS = 5 * 6e4;
var SEED_LOW_POOL = 10;
var LOW_POOL_RETRY_MS = 15 * 6e4;
var SEED_FALLBACK_TRIES = 3;
var SEED_FALLBACK_MIN_MS = 1e3;
var SEED_FALLBACK_REFRESH_MS = 15e3;
var SEED_FALLBACK_DEFAULT_MS = 1e4;
var DEAD_SEED_MS = 6 * 36e5;
var RESCUE_POOL_FRESH_MS = 15 * 6e4;
var DEAD_KEY = "deadSeeds";
var str2 = (v) => typeof v === "string" ? v : v === null || v === void 0 ? "" : String(v);
var blank2 = (v) => str2(v).trim() === "";
function makeLock() {
  let tail = Promise.resolve();
  return (task) => {
    const run = tail.then(task);
    tail = run.then(() => {
    }, () => {
    });
    return run;
  };
}
function seedEntry(e) {
  const out = { sn: str2(e.sn), userId: str2(e.userId), userToken: str2(e.userToken) };
  if (typeof e.exp === "number" && Number.isFinite(e.exp) && e.exp > 0) out.exp = e.exp;
  return out;
}
function makeSession({ kino: kino2, portal, clock: clock2, seedsUrl = DEFAULT_SEEDS_URL, random, shared }) {
  const rand = random || (() => parseInt(kino2.crypto.randomBytes(4, "hex"), 16) / 4294967296);
  const lock = makeLock();
  let lastPoolRefreshMs = null;
  let lastFailedRefreshMs = null;
  let inflight = null;
  let exhausted = false;
  const timeLeft = (bounds) => bounds && typeof bounds.deadline === "number" ? bounds.deadline - clock2.now() : Infinity;
  const readJson = (key) => {
    try {
      const raw = kino2.storage.get(key);
      return raw === null || raw === void 0 ? null : JSON.parse(raw);
    } catch (_) {
      return null;
    }
  };
  const writeJson = (key, value) => kino2.storage.set(key, JSON.stringify(value));
  const readSession = () => {
    const s = readJson("session");
    const o = s && typeof s === "object" ? s : {};
    return { userId: str2(o.userId), userToken: str2(o.userToken), jwtToken: str2(o.jwtToken), sn: str2(o.sn), acct: str2(o.acct) };
  };
  const writeSession = (s) => writeJson("session", {
    userId: str2(s.userId),
    userToken: str2(s.userToken),
    jwtToken: str2(s.jwtToken),
    sn: str2(s.sn),
    acct: str2(s.acct)
  });
  const view = () => {
    const s = readSession();
    return { userId: s.userId, userToken: s.userToken, sn: null };
  };
  const hasToken = () => !blank2(readSession().userToken);
  const accountKey = (email, password) => kino2.crypto.hash("sha256", str2(email) + "\n" + kino2.crypto.hash("md5", str2(password) + PASSWORD_SALT));
  const sharedPair = shared && !blank2(shared.email) && !blank2(shared.password) ? { email: str2(shared.email), password: str2(shared.password) } : null;
  const keyOf = (acc) => sharedPair && acc.email === sharedPair.email && acc.password === sharedPair.password ? "shared" : accountKey(acc.email, acc.password);
  const legacyShared = () => readJson("sharedAccount") === true;
  const dropLegacy = () => {
    try {
      if (kino2.storage.get("sharedAccount") !== null && kino2.storage.get("sharedAccount") !== void 0) kino2.storage.remove("sharedAccount");
    } catch (_) {
    }
  };
  const ownAccount = () => {
    const { email, password } = configuredPair(kino2.config);
    return blank2(email) || blank2(password) ? null : { email, password };
  };
  const configuredAccount = () => {
    const own = ownAccount();
    if (own) {
      dropLegacy();
      return own;
    }
    const toggle = kino2.config.get("useSharedAccount");
    if (toggle !== void 0) dropLegacy();
    const chosen = toggle === true || toggle === void 0 && legacyShared();
    return sharedPair && chosen ? sharedPair : null;
  };
  const REFUSAL_TTL_MS = 10 * 6e4;
  const LOGIN_COOLDOWN_MS = 6e4;
  const NOT_A_REFUSAL = /* @__PURE__ */ new Set([GEO_BLOCKED, "snToken_failed", "active_sin_token", "login_sin_token"]);
  const OWN_NOT_A_REFUSAL = /* @__PURE__ */ new Set([...NOT_A_REFUSAL, ...SESSION_DEAD, ACCOUNT_IN_USE_ELSEWHERE]);
  const refusal = (e, key) => e instanceof PortalError && !(key === "shared" ? NOT_A_REFUSAL : OWN_NOT_A_REFUSAL).has(e.code);
  const refusedKey = () => {
    const r = readJson("refusedAcct");
    if (!r || typeof r !== "object" || typeof r.key !== "string" || typeof r.at !== "number") return "";
    const age = clock2.now() - r.at;
    return age >= 0 && age < REFUSAL_TTL_MS ? r.key : "";
  };
  const setRefused = (key) => {
    try {
      writeJson("refusedAcct", { key, at: clock2.now() });
    } catch (_) {
    }
  };
  const clearRefused = (key) => {
    if (key === "") return;
    const r = readJson("refusedAcct");
    if (r && typeof r === "object" && r.key === key) {
      try {
        kino2.storage.remove("refusedAcct");
      } catch (_) {
      }
    }
  };
  let cooldown = { key: "", until: 0 };
  const cooling = (key) => cooldown.key === key && clock2.now() < cooldown.until;
  const startCooldown = (key) => {
    cooldown = { key, until: clock2.now() + LOGIN_COOLDOWN_MS };
  };
  const endCooldown = () => {
    cooldown = { key: "", until: 0 };
  };
  const account = () => {
    const acc = configuredAccount();
    return acc && keyOf(acc) !== refusedKey() ? acc : null;
  };
  const currentKey = () => {
    const acc = account();
    return acc ? keyOf(acc) : "";
  };
  const tokenHeld = () => hasToken() && readSession().acct === currentKey();
  const acctKind = (acc) => acc === sharedPair ? "shared" : "own";
  function mode() {
    try {
      const acc = account();
      if (acc) return acctKind(acc);
      const s = readSession();
      if (blank2(s.sn)) return "none";
      return seedPool().some((e) => e.sn === s.sn) ? "seed" : "anon";
    } catch (_) {
      return "?";
    }
  }
  const autoRefresh = () => kino2.config.get("autoRefreshSeeds") !== false;
  const regionBlocked = () => {
    const r = readJson("region");
    return !!(r && r.blocked === true);
  };
  const setRegion = (blocked) => {
    try {
      if (regionBlocked() !== blocked) writeJson("region", { blocked });
    } catch (_) {
    }
  };
  const seedPool = () => {
    const raw = readJson("seeds");
    if (!Array.isArray(raw)) return [];
    return raw.filter((e) => e && typeof e === "object" && !blank2(e.sn) && !blank2(e.userToken)).map(seedEntry);
  };
  const deadId = (e) => `${str2(e.sn)}|${str2(e.userToken).slice(-6)}`;
  const deadMarks = () => {
    const m = readJson(DEAD_KEY);
    const out = {};
    if (!m || typeof m !== "object" || Array.isArray(m)) return out;
    const now = clock2.now();
    for (const [k, at] of Object.entries(m)) if (typeof at === "number" && now - at >= 0 && now - at < DEAD_SEED_MS) out[k] = at;
    return out;
  };
  const markDead = (e) => {
    try {
      const marks = { ...deadMarks(), [deadId(e)]: clock2.now() };
      writeJson(DEAD_KEY, Object.fromEntries(Object.entries(marks).sort((a, b) => b[1] - a[1]).slice(0, MAX_SEEDS)));
    } catch (_) {
    }
  };
  const noteDeadSeed = (s) => {
    if (seedPool().some((p) => p.sn === s.sn && p.userToken === s.userToken)) markDead(s);
  };
  const usable = (pool) => {
    const marks = deadMarks();
    const any = Object.keys(marks).length > 0;
    return pool.filter((e) => (e.exp === void 0 || e.exp * 1e3 - clock2.now() >= SEED_MIN_LIFE_MS) && !(any && Object.hasOwn(marks, deadId(e))));
  };
  const pick = (pool) => pool[Math.min(pool.length - 1, Math.floor(rand() * pool.length))];
  const seedSession = (e) => ({ userId: e.userId, userToken: e.userToken, jwtToken: "", sn: e.sn, acct: "" });
  const surface = (e) => e instanceof PortalError ? mapPortalError(e.code, e.message, kino2) : e;
  const fingerprint = makeFingerprint(kino2);
  function saveFromResponse(j, acct = "") {
    writeSession({ userId: j.userId, userToken: j.userToken, jwtToken: j.jwtToken, sn: readSession().sn, acct });
  }
  async function activate(snToken, sn, bounds = {}) {
    const j = await portal.call("v8/active", activateBean(snToken), { baseFields: false, sn, ...bounds });
    if (blank2(j && j.userToken)) throw new PortalError("active_sin_token", "activaci\xF3n sin userToken");
    saveFromResponse(j);
  }
  async function mintDevice(bounds = {}) {
    const j = await portal.call("v3/snToken", fingerprint(), { baseFields: false, ...bounds });
    if (blank2(j && j.snToken)) throw new PortalError("snToken_failed", "el portal no devolvi\xF3 snToken");
    const snToken = str2(j.snToken);
    const sn = snFrom(kino2, j, snToken);
    writeSession({ userId: "", userToken: "", jwtToken: "", sn, acct: "" });
    await activate(snToken, sn, bounds);
  }
  async function directAnonymous(bounds = {}) {
    const storedSn = readSession().sn;
    if (!blank2(storedSn)) {
      try {
        await activate("", storedSn, bounds);
        trace(kino2, "session", "activate", { ok: true });
        return;
      } catch (e) {
        trace(kino2, "session", "activate", { ok: false, code: errCode(e) });
        if (!(e instanceof PortalError && INVALID_SN.has(e.code))) throw e;
      }
    }
    try {
      await mintDevice(bounds);
      trace(kino2, "session", "mint", { ok: true });
    } catch (e) {
      trace(kino2, "session", "mint", { ok: false, code: errCode(e) });
      throw e;
    }
  }
  async function ensureAnonymousUnlocked(bounds = {}) {
    if (hasToken() && readSession().acct === "") return;
    if (hasToken()) forgetToken();
    let direct;
    try {
      await directAnonymous(bounds);
      return;
    } catch (e) {
      direct = e;
    }
    if (direct instanceof PortalError && direct.code === GEO_BLOCKED) {
      trace(kino2, "session", "geo", { at: "activate" });
      setRegion(true);
    }
    let pool = usable(seedPool());
    if (pool.length === 0) {
      try {
        await refreshSeeds({ timeoutMs: BLOCKED_REFRESH_MS, deadline: bounds.deadline });
      } catch (_) {
      }
      pool = usable(seedPool());
    }
    if (pool.length > 0) {
      const chosen = pick(pool);
      writeSession(seedSession(chosen));
      report(kino2, "seed", "pick", { pool: pool.length, seed: seedTag(kino2, chosen.sn) });
      return;
    }
    trace(kino2, "session", "no_seed", { code: errCode(direct) });
    throw direct;
  }
  async function loginUnlocked(email, password, bounds = {}) {
    const bean = {
      accountType: "2",
      userName: email,
      password: kino2.crypto.hash("md5", password + PASSWORD_SALT),
      type: "1",
      macAddr: FIXED_MAC,
      areaCode: "",
      verificationCode: "",
      verificationToken: "",
      matadata: "",
      signdata: "",
      channel: "default"
    };
    const j = await portal.call("v8/login", bean, { baseFields: false, sn: readSession().sn || null, ...bounds });
    if (blank2(j && j.userToken)) throw new PortalError("login_sin_token", "login sin userToken");
    saveFromResponse(j, keyOf({ email, password }));
  }
  async function ensureUnlocked(bounds = {}) {
    if (tokenHeld()) return;
    const acc = account();
    const key = acc ? keyOf(acc) : "";
    const wait = acc !== null && cooling(key);
    if (wait && hasToken() && readSession().acct === "") return;
    if (hasToken() && readSession().acct !== "") forgetToken();
    if (acc && !wait) {
      try {
        await loginUnlocked(acc.email, acc.password, bounds);
        trace(kino2, "session", "login", { acct: acctKind(acc), ok: true });
        clearRefused(key);
        endCooldown();
        return;
      } catch (e) {
        const refused = refusal(e, key);
        report(kino2, "anon_fallback", "login", { acct: acctKind(acc), ok: false, code: errCode(e), refused });
        if (refused) setRefused(key);
        else startCooldown(key);
      }
    }
    await ensureAnonymousUnlocked(bounds);
  }
  function forgetToken() {
    const prev = readSession();
    if (prev.sn === "" && prev.userToken === "") return;
    writeSession({ ...prev, userId: "", userToken: "", jwtToken: "", acct: "" });
  }
  const renew = (stale, bounds = {}) => lock(async () => {
    const current = readSession().userToken;
    if (!blank2(current) && current !== stale) return { ok: true, loginError: null };
    if (timeLeft(bounds) < MIN_REQUEST_MS) {
      trace(kino2, "session", "reauth", { ok: false, why: "deadline" });
      return { ok: false, loginError: null };
    }
    forgetToken();
    let loginError = null;
    try {
      const acc = configuredAccount();
      if (acc) {
        try {
          await loginUnlocked(acc.email, acc.password, bounds);
          clearRefused(keyOf(acc));
          endCooldown();
        } catch (e) {
          if (!refusal(e, keyOf(acc))) {
            loginError = e;
            throw e;
          }
          setRefused(keyOf(acc));
          await ensureAnonymousUnlocked(bounds);
        }
      } else await ensureAnonymousUnlocked(bounds);
      trace(kino2, "session", "reauth", { ok: true, sess: mode() });
      return { ok: true, loginError: null };
    } catch (e) {
      trace(kino2, "session", "reauth", { ok: false, code: errCode(loginError || e), sess: mode() });
      return { ok: false, loginError };
    }
  });
  const transientLogin = (e) => e !== null && (e instanceof PortalError ? SESSION_DEAD.has(e.code) : isKinoError(e));
  const switchToBackup = (stale) => lock(async () => {
    const pool = usable(seedPool());
    if (pool.length === 0) return false;
    if (readSession().userToken !== stale) return true;
    const chosen = pick(pool);
    writeSession(seedSession(chosen));
    trace(kino2, "session", "seed_switch", { pool: pool.length, seed: seedTag(kino2, chosen.sn) });
    return true;
  });
  async function fetchSeeds(timeoutMs) {
    let res;
    try {
      res = await kino2.fetch(seedsUrl, { timeoutMs });
    } catch (e) {
      trace(kino2, "seeds", "refresh", { ok: false, why: "fetch", code: errCode(e) });
      return false;
    }
    if (res && res.ok === false) {
      report(kino2, "seeds", "refresh", { ok: false, why: "http", status: res.status });
      return false;
    }
    let list;
    try {
      list = JSON.parse(res.text());
    } catch (_) {
      list = null;
    }
    if (!Array.isArray(list)) {
      report(kino2, "seeds", "refresh", { ok: false, why: "parse" });
      return false;
    }
    const clean = list.filter((e) => e && typeof e === "object" && !blank2(e.sn) && !blank2(e.userToken)).slice(0, MAX_SEEDS).map(seedEntry);
    if (clean.length === 0) {
      trace(kino2, "seeds", "refresh", { ok: false, why: "empty" });
      return false;
    }
    try {
      writeJson("seeds", clean);
    } catch (_) {
      trace(kino2, "seeds", "refresh", { ok: false, why: "store", n: clean.length });
      return false;
    }
    try {
      writeJson("seedsAt", clock2.now());
    } catch (_) {
    }
    trace(kino2, "seeds", "refresh", { ok: true, n: clean.length });
    return true;
  }
  async function refreshSeeds({ periodic = false, timeoutMs = 15e3, deadline, manual = false } = {}) {
    const has = () => seedPool().length > 0;
    if (periodic) {
      if (!autoRefresh() || !regionBlocked() || account()) return has();
      const at = readJson("seedsAt");
      const stored = seedPool();
      const draining = usable(stored).length < Math.min(SEED_LOW_POOL, stored.length);
      const wait = draining ? LOW_POOL_RETRY_MS : PERIODIC_REFRESH_MS;
      if (typeof at === "number" && clock2.now() - at < wait) return has();
      try {
        writeJson("seedsAt", clock2.now());
      } catch (_) {
      }
    }
    const now = clock2.now();
    const recent = (at, ms) => at !== null && now - at >= 0 && now - at < ms;
    if (inflight === null) {
      if (recent(lastPoolRefreshMs, POOL_REFRESH_COOLDOWN_MS)) return has();
      if (!manual && recent(lastFailedRefreshMs, FAILED_REFRESH_COOLDOWN_MS)) return has();
      const ms = Math.min(timeoutMs, Math.floor(timeLeft({ deadline })));
      if (ms < MIN_REQUEST_MS) return has();
      const promise = fetchSeeds(ms).then((stored) => {
        inflight = null;
        if (stored) lastPoolRefreshMs = now;
        else lastFailedRefreshMs = now;
      });
      inflight = { promise, endsBy: now + ms };
    } else if (typeof deadline === "number" && inflight.endsBy > deadline) {
      return has();
    }
    await inflight.promise;
    return has();
  }
  async function ensure(bounds = {}) {
    await null;
    if (!tokenHeld()) {
      try {
        await refreshSeeds({ periodic: true, timeoutMs: PERIODIC_TIMEOUT_MS, deadline: bounds.deadline });
      } catch (_) {
      }
    }
    try {
      await lock(() => ensureUnlocked(bounds));
    } catch (e) {
      throw surface(e);
    }
  }
  async function login(email, password, bounds = {}) {
    await null;
    const key = keyOf({ email, password });
    try {
      await lock(async () => {
        await loginUnlocked(email, password, bounds);
        clearRefused(key);
        endCooldown();
        dropLegacy();
      });
      trace(kino2, "session", "login_action", { acct: "own", ok: true });
    } catch (e) {
      trace(kino2, "session", "login_action", { acct: "own", ok: false, code: errCode(e) });
      if (e instanceof PortalError) {
        if (refusal(e, key)) setRefused(key);
        throw kino2.error("auth_required", "Credenciales de Xuper inv\xE1lidas");
      }
      throw e;
    }
  }
  async function useShared(bounds = {}) {
    await null;
    if (!sharedPair) throw kino2.error("unavailable", "La cuenta compartida no est\xE1 disponible");
    try {
      await lock(async () => {
        await loginUnlocked(sharedPair.email, sharedPair.password, bounds);
        clearRefused("shared");
        endCooldown();
      });
      trace(kino2, "session", "login_action", { acct: "shared", ok: true });
    } catch (e) {
      trace(kino2, "session", "login_action", { acct: "shared", ok: false, code: errCode(e) });
      if (e instanceof PortalError) {
        if (refusal(e, "shared")) setRefused("shared");
        throw kino2.error("auth_required", "No se pudo activar la cuenta compartida");
      }
      throw e;
    }
  }
  async function logout(bounds = {}) {
    await null;
    try {
      await lock(async () => {
        dropLegacy();
        const prev = readSession();
        if (!blank2(prev.userToken)) {
          try {
            await portal.call(
              "v5/loginOut",
              { userId: prev.userId, userToken: prev.userToken },
              { baseFields: false, sn: prev.sn || null, ...bounds }
            );
          } catch (_) {
          }
        }
        forgetToken();
        await ensureAnonymousUnlocked(bounds);
      });
    } catch (e) {
      throw surface(e);
    }
  }
  const blockedOrDead = (e) => e.code === GEO_BLOCKED || SESSION_DEAD.has(e.code);
  async function seedFallback(block, deadline) {
    const left = () => deadline - clock2.now();
    let pool = usable(seedPool());
    let refreshed = false;
    if (pool.length === 0 && left() >= SEED_FALLBACK_MIN_MS) {
      refreshed = true;
      try {
        await refreshSeeds({ timeoutMs: SEED_FALLBACK_REFRESH_MS, deadline });
      } catch (_) {
      }
      pool = usable(seedPool());
    }
    const seen = /* @__PURE__ */ new Set();
    const candidates = pool.filter((e) => !seen.has(e.sn) && seen.add(e.sn));
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.min(i, Math.floor(rand() * (i + 1)));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    const note = (tries2, outcome) => outcome === "answered" ? report(kino2, "shared_seed", "answered", { tries: tries2, pool: candidates.length, refreshed }) : trace(kino2, "session", "seed_fallback", { outcome, tries: tries2, pool: candidates.length, refreshed });
    let tries = 0;
    for (const c of candidates.slice(0, SEED_FALLBACK_TRIES)) {
      if (left() < SEED_FALLBACK_MIN_MS) break;
      tries++;
      try {
        const value = await block({ userId: c.userId, userToken: c.userToken, sn: c.sn, deadline });
        note(tries, "answered");
        return { value };
      } catch (e) {
        if (e instanceof PortalError && SESSION_DEAD.has(e.code)) markDead(c);
        if (e instanceof PortalError && !blockedOrDead(e)) {
          note(tries, "answered");
          return { err: e };
        }
        if (!(e instanceof PortalError) && !isKinoError(e)) throw e;
      }
    }
    note(tries, left() < SEED_FALLBACK_MIN_MS ? "out_of_time" : "none");
    return null;
  }
  async function withValidSession(block, { seedFallback: allowSeeds = false, deadline } = {}) {
    await null;
    const startedAt = clock2.now();
    const bounds = typeof deadline === "number" ? { deadline } : {};
    const onSeed = () => {
      const sn = readSession().sn;
      return seedPool().some((e) => e.sn === sn);
    };
    const ownLinked = () => account() !== null && !usingShared();
    const settle = (r) => {
      if (r.err) throw mapPortalError(r.err.code, r.err.message, kino2, { accountLinked: ownLinked(), sharedAccount: sharedConfigured() });
      exhausted = false;
      if (regionBlocked() && !onSeed()) setRegion(false);
      return r.value;
    };
    const attempt = async () => {
      const used = readSession();
      try {
        return { value: await block({ ...view(), ...bounds }) };
      } catch (e) {
        if (e instanceof PortalError) {
          if (SESSION_DEAD.has(e.code)) noteDeadSeed(used);
          return { err: e };
        }
        throw e;
      }
    };
    const tokenUsed = view().userToken;
    let result = await attempt();
    if (!result.err) return settle(result);
    trace(kino2, "session", "err", { code: result.err.code, sess: mode() });
    if (result.err.code === GEO_BLOCKED) {
      trace(kino2, "session", "geo", { at: "content", sess: mode() });
      setRegion(true);
      if (!account()) {
        if (seedPool().length === 0) {
          try {
            await refreshSeeds({ timeoutMs: BLOCKED_REFRESH_MS, deadline });
          } catch (_) {
          }
        }
        if (await switchToBackup(tokenUsed)) result = await attempt();
        if (!result.err) return settle(result);
      }
    }
    let renewal = await renew(tokenUsed, bounds);
    if (SESSION_DEAD.has(result.err.code) && ownLinked() && transientLogin(renewal.loginError)) {
      renewal = await renew(view().userToken, bounds);
    }
    const loginError = renewal.loginError;
    if (loginError instanceof PortalError && loginError.code === ACCOUNT_IN_USE_ELSEWHERE && ownLinked()) result = { err: loginError };
    if (renewal.ok) {
      const retryToken = view().userToken;
      result = await attempt();
      if (!result.err) return settle(result);
      if (ownLinked() && SESSION_DEAD.has(result.err.code) && (await renew(retryToken, bounds)).ok) {
        result = await attempt();
        if (!result.err) return settle(result);
      }
    }
    if (SESSION_DEAD.has(result.err.code) && !account()) {
      setRegion(true);
      let rounds = 0;
      const poolFresh = () => {
        const at = readJson("seedsAt");
        const age = typeof at === "number" ? clock2.now() - at : Infinity;
        const inUse = view().userToken;
        return age >= 0 && age < RESCUE_POOL_FRESH_MS && usable(seedPool()).some((e) => e.userToken !== inUse);
      };
      for (let round = 0; round < SEED_RESCUE_ROUNDS; round++) {
        if (timeLeft(bounds) < MIN_REQUEST_MS) break;
        rounds++;
        if ((poolFresh() || await refreshSeeds({ deadline })) && await switchToBackup(view().userToken)) {
          const retry = await attempt();
          if (!retry.err || !SESSION_DEAD.has(retry.err.code)) {
            exhausted = false;
            trace(kino2, "session", "rescued", { round: rounds });
            return settle(retry);
          }
        }
      }
      exhausted = true;
      trace(kino2, "session", "exhausted", { rounds });
    }
    if (allowSeeds && blockedOrDead(result.err) && usingShared()) {
      const rescued = await seedFallback(block, typeof deadline === "number" ? deadline : startedAt + SEED_FALLBACK_DEFAULT_MS);
      if (rescued) {
        if (rescued.err) throw mapPortalError(rescued.err.code, rescued.err.message, kino2, { sharedAccount: true });
        return rescued.value;
      }
    }
    return settle(result);
  }
  async function switchSeed({ timeoutMs, deadline } = {}) {
    await null;
    const out = await lock(async () => {
      if (account()) return { result: "account_linked", tries: 0 };
      const current = readSession().sn;
      const candidates = usable(seedPool()).filter((e) => e.sn !== current);
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.min(i, Math.floor(rand() * (i + 1)));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      if (candidates.length === 0) return { result: "no_other_seed", tries: 0 };
      let tries = 0;
      let reached = false;
      for (const c of candidates.slice(0, SEED_SWITCH_TRIES)) {
        if (typeof deadline === "number" && clock2.now() >= deadline) break;
        tries++;
        try {
          const j = await portal.call("v8/active", activateBean(""), { baseFields: false, sn: c.sn, timeoutMs, deadline });
          reached = true;
          if (blank2(j && j.userToken)) continue;
          writeSession({ userId: j.userId, userToken: j.userToken, jwtToken: j.jwtToken, sn: c.sn, acct: "" });
          return { result: "ok", tries };
        } catch (e) {
          if (e instanceof PortalError) reached = true;
        }
      }
      if (typeof deadline === "number" && !reached) return { result: "offline", tries };
      return { result: "all_failed", tries };
    });
    trace(kino2, "seeds", "switch", { result: out.result, tries: out.tries });
    return out;
  }
  const adoptSession = (s) => lock(async () => {
    writeSession(s);
    clearRefused(str2(s.acct));
    dropLegacy();
    setRegion(false);
    exhausted = false;
  });
  const usingShared = () => {
    const a = account();
    return a !== null && a === sharedPair;
  };
  const sharedConfigured = () => {
    const a = configuredAccount();
    return a !== null && a === sharedPair;
  };
  function accountState() {
    const conf = configuredAccount();
    if (!conf) return "none";
    if (keyOf(conf) === refusedKey()) return "refused";
    return tokenHeld() ? "held" : "pending";
  }
  function kind() {
    if (accountState() === "held") return "account";
    const s = readSession();
    if (blank2(s.sn)) return "none";
    return seedPool().some((e) => e.sn === s.sn) ? "seed" : "own";
  }
  return {
    ensure,
    withValidSession,
    current: readSession,
    kind,
    mode,
    accountState,
    accountKey,
    usingShared,
    sharedConfigured,
    login,
    useShared,
    logout,
    regionBlocked,
    seedsExhausted: () => exhausted,
    switchSeed,
    refreshSeeds,
    seedPool,
    adoptSession
  };
}

// src/homeClassifier.js
var KINDS = [
  { root: "peliculas", label: "Pel\xEDculas", en: "Movies" },
  { root: "series", label: "Series", en: "Series" },
  { root: "anime", label: "Anime", en: "Anime" },
  { root: "infantil", label: "Infantil", en: "Kids" }
];
var byRoot = Object.fromEntries(KINDS.map((k) => [k.root, k]));
var MIN_GENRE_SIZE = 6;
var MAX_ROW_SIZE = 20;
var TRAILER = "trailer";
var PRECEDENCE = ["anime", "infantil", "series", "peliculas"];
var FEATURED = ["peliculas", "series"];
var GENRES = new Map(Object.entries({
  "Action": ["action", "Acci\xF3n"],
  "Adventure": ["adventure", "Aventura"],
  "Comedy": ["comedy", "Comedia"],
  "Drama": ["drama", "Drama"],
  "Thriller": ["thriller", "Suspenso"],
  "Crime": ["crime", "Crimen"],
  "Sci-Fi": ["scifi", "Ciencia ficci\xF3n"],
  "Fantasy": ["fantasy", "Fantas\xEDa"],
  "Romance": ["romance", "Romance"],
  "Mystery": ["mystery", "Misterio"],
  "Horror": ["horror", "Terror"],
  "Family": ["family", "Familia"],
  "Biography": ["biography", "Biograf\xEDa"],
  "History": ["history", "Historia"],
  "Documentary": ["documentary", "Documental"],
  "Western": ["western", "Western"],
  "War": ["war", "Guerra"],
  "Reality-TV": ["reality", "Reality"],
  "Sport": ["sport", "Deportes"],
  "Music": ["music", "M\xFAsica"],
  "Musical": ["music", "M\xFAsica"]
}));
var GENRES_EN = Object.freeze({
  action: "Action",
  adventure: "Adventure",
  comedy: "Comedy",
  drama: "Drama",
  thriller: "Thriller",
  crime: "Crime",
  scifi: "Sci-Fi",
  fantasy: "Fantasy",
  romance: "Romance",
  mystery: "Mystery",
  horror: "Horror",
  family: "Family",
  biography: "Biography",
  history: "History",
  documentary: "Documentary",
  western: "Western",
  war: "War",
  reality: "Reality",
  sport: "Sports",
  music: "Music"
});
var YEAR_SECTION = /^(\d{4})(.*)$/;
var FEATURED_PREFIXES = ["magis_recent_", "magis_new_", "magis_top_"];
var isFeatured = (rowId) => FEATURED_PREFIXES.some((p) => rowId.startsWith(p));
function rootOfRow(rowId) {
  if (typeof rowId !== "string") return null;
  const prefix = [...FEATURED_PREFIXES, "magis_g_"].find((p) => rowId.startsWith(p));
  if (prefix === void 0) return null;
  const rest = rowId.slice(prefix.length);
  const root = prefix === "magis_g_" ? rest.slice(0, Math.max(0, rest.indexOf("_"))) : rest;
  return Object.hasOwn(byRoot, root) ? root : null;
}
function localizedRowTitle(row2, english) {
  if (!english) return row2.title;
  const fixed = {
    magis_recent_peliculas: "Recently added \xB7 Movies",
    magis_new_series: "Series with new episodes",
    magis_top_peliculas: "Top rated movies",
    magis_top_series: "Top rated series",
    magis_new_peliculas: "In theaters"
  };
  if (Object.hasOwn(fixed, row2.id)) return fixed[row2.id];
  const root = rootOfRow(row2.id);
  if (root !== null && row2.id.startsWith(`magis_g_${root}_`)) {
    const key = row2.id.slice(`magis_g_${root}_`.length);
    if (Object.hasOwn(GENRES_EN, key)) return `${GENRES_EN[key]} \xB7 ${byRoot[root].en}`;
  }
  return row2.title;
}
function genreOfRow(rowId) {
  const root = rootOfRow(rowId);
  if (root === null) return null;
  return rowId === `magis_g_${root}_documentary` ? "documentales" : root;
}
var cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0;
var byScore = (a, b) => cmp(b.score ?? -1, a.score ?? -1) || cmp(a.title, b.title) || cmp(a.id, b.id);
var plain = (text2) => text2.toLowerCase().normalize("NFD").replace(/\p{Mn}+/gu, "").trim();
function distinctBy(list, key) {
  const seen = /* @__PURE__ */ new Set();
  return list.filter((x) => {
    const k = key(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
var row = (id, title2, items) => ({ id, title: title2, shown: items.slice(0, MAX_ROW_SIZE), all: items });
var genresOf = (item) => distinctBy(item.genres.map((g) => GENRES.get(g.trim())).filter((g) => g !== void 0), (g) => g[0]);
var newestFirst = (items) => items.some((i) => i.shelvedAtMs > 0) ? [...items].sort((a, b) => b.shelvedAtMs - a.shelvedAtMs) : items;
var playable = (section2) => distinctBy(section2.items.filter((i) => i.type !== TRAILER), (i) => i.id);
function yearSections(sections) {
  const out = [];
  for (const s of sections) {
    const m = YEAR_SECTION.exec(s.name.trim());
    if (m) out.push({ year: Number(m[1]), suffix: plain(m[2]), section: s });
  }
  return out.sort((a, b) => b.year - a.year);
}
function plainYearSection(sections) {
  for (const y of yearSections(sections)) {
    if (y.suffix !== "") continue;
    const items = playable(y.section);
    if (items.length > 0) return items;
  }
  return null;
}
function recentMoviesRow(sectionsOf) {
  const items = plainYearSection(sectionsOf.peliculas);
  return items && row("magis_recent_peliculas", "Reci\xE9n agregadas \xB7 Pel\xEDculas", newestFirst(items));
}
function updatedSeriesRow(sectionsOf) {
  const items = plainYearSection(sectionsOf.series);
  return items && row("magis_new_series", "Series con cap\xEDtulos nuevos", newestFirst(items));
}
function cinemaRow(sectionsOf) {
  for (const y of yearSections(sectionsOf.peliculas)) {
    if (!y.suffix.includes("teatral")) continue;
    const items = playable(y.section);
    if (items.length > 0) return row("magis_new_peliculas", "Estrenos de cine", items);
  }
  return null;
}
function topRatedRows(byKind) {
  const out = [];
  for (const root of FEATURED) {
    const ranked = [...byKind[root]].sort(byScore);
    if (ranked.length === 0) continue;
    out.push({
      id: `magis_top_${root}`,
      title: `${byRoot[root].label} mejor valoradas`,
      shown: ranked.slice(0, MAX_ROW_SIZE),
      all: ranked
    });
  }
  return out;
}
function genreRows(byKind) {
  const perKind = KINDS.map(({ root }) => {
    const members = /* @__PURE__ */ new Map();
    const labels = /* @__PURE__ */ new Map();
    for (const item of byKind[root]) {
      for (const [key, label] of genresOf(item)) {
        if (!members.has(key)) members.set(key, []);
        members.get(key).push(item);
        labels.set(key, label);
      }
    }
    const groups = [];
    for (const [key, items] of members) {
      if (items.length >= MIN_GENRE_SIZE) groups.push({ root, key, label: labels.get(key), items });
    }
    return groups.sort((a, b) => b.items.length - a.items.length || cmp(a.label, b.label));
  });
  const ordered = [];
  const longest = Math.max(0, ...perKind.map((g) => g.length));
  for (let i = 0; i < longest; i++) for (const groups of perKind) if (groups[i]) ordered.push(groups[i]);
  const seen = /* @__PURE__ */ new Set();
  return ordered.map((g) => {
    const shown = [...g.items].sort((a, b) => (seen.has(a.id) ? 1 : 0) - (seen.has(b.id) ? 1 : 0) || byScore(a, b)).slice(0, MAX_ROW_SIZE);
    for (const i of shown) seen.add(i.id);
    return {
      id: `magis_g_${g.root}_${g.key}`,
      title: `${g.label} \xB7 ${byRoot[g.root].label}`,
      shown,
      all: [...g.items].sort(byScore)
    };
  });
}
function classify(roots) {
  const sectionsOf = Object.fromEntries(KINDS.map((k) => [k.root, roots[k.root] || []]));
  const kindOf = /* @__PURE__ */ new Map();
  for (const root of PRECEDENCE) {
    for (const section2 of sectionsOf[root]) {
      for (const item of section2.items) {
        if (item.type !== TRAILER && !kindOf.has(item.id)) kindOf.set(item.id, [root, item]);
      }
    }
  }
  const byKind = Object.fromEntries(KINDS.map((k) => [k.root, []]));
  for (const [root, item] of kindOf.values()) byKind[root].push(item);
  return [recentMoviesRow(sectionsOf), updatedSeriesRow(sectionsOf)].filter(Boolean).concat(topRatedRows(byKind), [cinemaRow(sectionsOf)].filter(Boolean), genreRows(byKind));
}
var FEATURED_ORDER = ["magis_recent_peliculas", "magis_new_series", "magis_top_peliculas", "magis_top_series", "magis_new_peliculas"];
function orderRows(rows) {
  const featured = FEATURED_ORDER.map((id) => rows.find((r) => r.id === id)).filter(Boolean);
  const genre = KINDS.map(({ root }) => rows.filter((r) => !isFeatured(r.id) && rootOfRow(r.id) === root));
  const out = [...featured];
  const longest = Math.max(0, ...genre.map((g) => g.length));
  for (let i = 0; i < longest; i++) for (const g of genre) if (g[i]) out.push(g[i]);
  return out;
}
function mergeRoot(rows, root, rootRows) {
  return orderRows([...rows.filter((r) => rootOfRow(r.id) !== root), ...rootRows]);
}

// src/channelId.js
var ID = /^[A-Za-z0-9._~-]{1,128}$/;
var REF_PREFIX = "xlive1:";
var MAX_CODE_CHARS = 2e3;
var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var plainCode = (code) => ID.test(code) && !code.startsWith("~") && !code.startsWith("x.");
function b64url(bytes) {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const n = bytes[i] << 16 | (bytes[i + 1] ?? 0) << 8 | (bytes[i + 2] ?? 0);
    out += B64[n >> 18 & 63] + B64[n >> 12 & 63];
    if (i + 1 < bytes.length) out += B64[n >> 6 & 63];
    if (i + 2 < bytes.length) out += B64[n & 63];
  }
  return out;
}
function hash128(s) {
  const lanes = [2166136261, 16777619 ^ 2654435769, 3735928559, 1103547991];
  const mul = [16777619, 2246822519, 3266489917, 668265263];
  for (const b of new TextEncoder().encode(s)) {
    for (let i = 0; i < 4; i++) {
      lanes[i] = Math.imul(lanes[i] ^ b + i, mul[i]);
      lanes[i] ^= lanes[(i + 1) % 4] >>> 13;
    }
  }
  return lanes.map((n) => (n >>> 0).toString(16).padStart(8, "0")).join("");
}
function channelOf(code) {
  if (typeof code !== "string" || code.trim() === "" || code.length > MAX_CODE_CHARS) return null;
  if (plainCode(code)) return { id: code, ref: code };
  const body = b64url(new TextEncoder().encode(code));
  const id = ("x.b" + body).length <= 128 ? "x.b" + body : "x.h" + hash128(code);
  return { id, ref: REF_PREFIX + code };
}
var idOfCode = (code) => channelOf(code)?.id ?? null;
var isWrappedRef = (ref) => typeof ref === "string" && ref.startsWith(REF_PREFIX) && ref.length > REF_PREFIX.length && ref.length <= 4096;
var codeOfRef = (ref) => isWrappedRef(ref) ? ref.slice(REF_PREFIX.length) : ref;

// src/refs.js
var PREFIX = "magis1";
var SERIES = /* @__PURE__ */ new Set(["teleplay", "series", "variety"]);
var isSeries = (programType) => SERIES.has(programType);
var INT2 = /^[+-]?\d+$/;
function toIntOrNull(text2) {
  if (!INT2.test(text2)) return null;
  const n = Number(text2);
  return n >= -2147483648 && n <= 2147483647 ? n : null;
}
var make = (contentId, programType, episode) => ({ contentId, programType, episode, isSeries: isSeries(programType) });
function encode({ contentId, programType = "movie", episode = 0 }) {
  return `${PREFIX}:${programType || "movie"}:${episode}:${contentId}`;
}
function encodeChapter(seriesNumber, seasonContentId) {
  return encode({ contentId: seasonContentId, programType: "teleplay", episode: seriesNumber });
}
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function base64UrlToText(data) {
  const body = data.replace(/={1,2}$/, "");
  if (body.length % 4 === 1 || /[^A-Za-z0-9_-]/.test(body)) return null;
  const bytes = [];
  let acc = 0, bits = 0;
  for (const ch of body) {
    acc = acc << 6 | ALPHABET.indexOf(ch);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push(acc >> bits & 255);
      acc &= (1 << bits) - 1;
    }
  }
  return utf8(bytes);
}
function utf8(bytes) {
  let out = "";
  for (let i = 0; i < bytes.length; ) {
    const b = bytes[i];
    if (b < 128) {
      out += String.fromCharCode(b);
      i++;
      continue;
    }
    const need = b >= 194 && b < 224 ? 1 : b >= 224 && b < 240 ? 2 : b >= 240 && b < 245 ? 3 : 0;
    if (need === 0 || i + need > bytes.length - 1) {
      out += "\uFFFD";
      i++;
      continue;
    }
    let cp = b & 255 >> need + 2;
    let ok = true;
    for (let k = 1; k <= need; k++) {
      const c = bytes[i + k];
      if ((c & 192) !== 128) {
        ok = false;
        break;
      }
      cp = cp << 6 | c & 63;
    }
    if (!ok || cp > 1114111) {
      out += "\uFFFD";
      i++;
      continue;
    }
    out += String.fromCodePoint(cp);
    i += need + 1;
  }
  return out;
}
function optInt(v) {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string") {
    const n = Number(v.trim());
    return v.trim() !== "" && Number.isFinite(n) ? Math.trunc(n) : 0;
  }
  return 0;
}
function fromGatewayRef(ref) {
  const dot = ref.indexOf(".");
  if (dot < 0) return null;
  const data = ref.slice(0, dot);
  if (isBlank(data)) return null;
  let json;
  try {
    const text2 = base64UrlToText(data);
    json = text2 === null ? null : JSON.parse(text2);
  } catch (_) {
    return null;
  }
  if (json === null || typeof json !== "object" || Array.isArray(json)) return null;
  if (asText(json.s) !== "magis") return null;
  const p = json.p;
  if (p === null || typeof p !== "object" || Array.isArray(p)) return null;
  const contentId = asText(p.content_id);
  if (isBlank(contentId)) return null;
  return make(contentId, asText(p.program_type).trim() === "" ? "movie" : asText(p.program_type), optInt(p.episode));
}
function decode(ref) {
  if (typeof ref !== "string" || isBlank(ref)) return null;
  if (ref.startsWith(PREFIX + ":")) {
    const parts = ref.split(":");
    if (parts.length < 4) return null;
    const contentId = parts.slice(3).join(":");
    if (isBlank(contentId)) return null;
    const type = parts[1];
    return make(contentId, type.trim() === "" ? "movie" : type, toIntOrNull(parts[2]) ?? 0);
  }
  return fromGatewayRef(ref);
}
var CHANNEL_CODE = /^[A-Za-z0-9._~-]{1,128}$/;
function isChannelRef(ref) {
  if (isWrappedRef(ref)) return true;
  return typeof ref === "string" && CHANNEL_CODE.test(ref) && !ref.startsWith("~") && decode(ref) === null;
}

// src/homeTree.js
var PORTAL_OFFSET_MS = 8 * 36e5;
var nonBlank = (v) => {
  const s = asText(v);
  return s.trim() === "" ? null : s;
};
var DEC = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
function numberOrNull(v) {
  if (v === null || v === void 0) return null;
  const s = String(v);
  return DEC.test(s) ? Number(s) : null;
}
function parseShelveTime(text2) {
  const raw = typeof text2 === "string" ? text2.trim() : "";
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/.exec(raw);
  if (!m) return 0;
  const [y, mo, d, h, mi, s] = m.slice(1).map(Number);
  const t = Date.UTC(y, mo - 1, d, h, mi, s);
  const back = new Date(t);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d || back.getUTCHours() !== h || back.getUTCMinutes() !== mi || back.getUTCSeconds() !== s) return 0;
  return t - PORTAL_OFFSET_MS;
}
function imageOf(asset, fileType) {
  if (!Array.isArray(asset.posterList)) return null;
  for (const p of asset.posterList) {
    if (p && p.fileType === fileType && !isBlank(p.fileUrl)) return p.fileUrl;
  }
  return null;
}
var logoOf = (a) => imageOf(a, "icon") ?? nonBlank(a.posterUrl);
function itemFrom(a) {
  if (a === null || typeof a !== "object") return null;
  const id = nonBlank(a.contentId);
  if (id === null) return null;
  const type = nonBlank(a.programType) ?? "movie";
  const tags = asText(a.tags).split(",").map((t) => t.trim()).filter((t) => t !== "");
  return {
    id,
    title: asText(a.name),
    poster: imageOf(a, "icon") ?? nonBlank(a.posterUrl),
    backdrop: imageOf(a, "poster"),
    durationS: intOrNull(a.duration) ?? 0,
    type,
    genres: tags,
    score: numberOrNull(a.score),
    description: asText(a.description),
    shelvedAtMs: parseShelveTime(asText(a.shelveTime))
  };
}
function parseTree(response) {
  const columns = response && Array.isArray(response.recommendList) ? response.recommendList : [];
  const sections = [];
  for (const c of columns) {
    if (c === null || typeof c !== "object") continue;
    const name = nonBlank(c.name);
    if (name === null) continue;
    const items = [];
    if (Array.isArray(c.assetList)) for (const a of c.assetList) {
      const it = itemFrom(a);
      if (it) items.push(it);
    }
    sections.push({ name, items });
  }
  return sections;
}
var refOf = (item) => encode({ contentId: item.id, programType: item.type, episode: 0 });
function storedLength(s) {
  let n = s.length + countOf(s, /["\\/\t\b\n\r\f]/g) + 5 * countOf(s, /[\x00-\x07\x0b\x0e-\x1f]/g);
  if (NON_ASCII.test(s)) {
    const pairs = countOf(s, /[\ud800-\udbff][\udc00-\udfff]/g) / 2;
    n += countOf(s, /[\u0080-\u07ff]/g) + 2 * countOf(s, /[\u0800-\ud7ff\ue000-\uffff]/g) + 2 * pairs + 2 * (countOf(s, /[\ud800-\udfff]/g) - 2 * pairs);
  }
  return n;
}
var NON_ASCII = /[^\x00-\x7f]/;
var countOf = (s, re) => s.length - s.replace(re, "").length;

// src/rowsStore.js
var ROWS_FORMAT = 1;
var META_KEY = "rows:meta";
var PART_PREFIX = "rows:";
var SNAPSHOT_BUDGET_BYTES = 8e4;
var PART_BUDGET_BYTES = 2e4;
var META_RESERVE_BYTES = 400;
var PART_TAG_BYTES = 16;
var TEXT_BUDGET_BYTES = SNAPSHOT_BUDGET_BYTES - META_RESERVE_BYTES - 4 * PART_TAG_BYTES;
function commonPrefix(urls) {
  if (urls.length === 0) return "";
  let p = urls[0];
  for (const u of urls) {
    while (!u.startsWith(p)) p = p.slice(0, -1);
    if (p === "") break;
  }
  return p.length >= 12 ? p : "";
}
function collect(rows, keepFull) {
  const index = /* @__PURE__ */ new Map();
  const items = [];
  const refs = rows.map((r, n) => {
    const shown = n < keepFull ? r.shown : r.shown.slice(0, 1);
    return shown.map((i) => {
      let k = index.get(i);
      if (k === void 0) {
        k = items.length;
        index.set(i, k);
        items.push(i);
      }
      return k;
    });
  });
  return { items, refs };
}
var descCost = (d) => storedLength(JSON.stringify(d)) - 4;
function encodeRows(rows, { descItems = Infinity, genres = true, keepFull = Infinity } = {}) {
  const { items, refs } = collect(rows, keepFull);
  const urls = [];
  for (const i2 of items) {
    if (i2.poster) urls.push(i2.poster);
    if (i2.backdrop) urls.push(i2.backdrop);
  }
  const p = commonPrefix(urls);
  const strip = (u) => u ? u.slice(p.length) : null;
  const genreIx = /* @__PURE__ */ new Map();
  const typeIx = /* @__PURE__ */ new Map();
  const ix = (map, v) => {
    let k = map.get(v);
    if (k === void 0) {
      k = map.size;
      map.set(v, k);
    }
    return k;
  };
  const i = items.map((it, n) => [
    it.id,
    it.title,
    strip(it.poster),
    strip(it.backdrop),
    it.durationS,
    ix(typeIx, it.type),
    genres ? it.genres.map((g) => ix(genreIx, g)) : [],
    it.score,
    n < descItems ? it.description : "",
    it.shelvedAtMs > 0 ? Math.round(it.shelvedAtMs / 1e3) : 0
  ]);
  const r = rows.map((row2, n) => [row2.id, row2.title, refs[n]]);
  const c = keepFull >= rows.length || rows.slice(keepFull).every((row2) => row2.shown.length <= 1) ? 1 : 0;
  return JSON.stringify({ v: ROWS_FORMAT, c, p, g: [...genreIx.keys()], t: [...typeIx.keys()], i, r });
}
function fitRows(rows, { budget = TEXT_BUDGET_BYTES, keepFull = Infinity } = {}) {
  const partial = keepFull < rows.length ? keepFull : Infinity;
  const homeItems = collect(rows.slice(0, keepFull), Infinity).items.length;
  const steps = [
    { keepFull: Infinity, genres: true, least: homeItems },
    { keepFull: partial, genres: true, least: 0 },
    { keepFull: partial, genres: false, least: 0 }
  ];
  for (let s = 0; s < steps.length; s++) {
    const { keepFull: kf, genres, least } = steps[s];
    const items = collect(rows, kf).items;
    let floor = 0;
    for (let n = 0; n < items.length && floor <= budget; n++) {
      floor += items[n].id.length + items[n].title.length + 9 + (n < least ? items[n].description.length : 0);
    }
    if (floor > budget) continue;
    const whole2 = encodeRows(rows, { keepFull: kf, genres });
    let size = storedLength(whole2);
    if (size <= budget) return { text: whole2, step: s };
    let k = items.length;
    while (k > 0 && size > budget) {
      k--;
      size -= descCost(items[k].description);
    }
    if (size > budget || k < least) continue;
    const fitted = encodeRows(rows, { keepFull: kf, genres, descItems: k });
    if (storedLength(fitted) <= budget) return { text: fitted, step: s };
  }
  return null;
}
var isIndexList = (a, n) => Array.isArray(a) && a.every((k) => Number.isInteger(k) && k >= 0 && k < n);
function decodeRows(text2) {
  const o = JSON.parse(text2);
  if (o === null || typeof o !== "object" || o.v !== ROWS_FORMAT || typeof o.p !== "string" || !Array.isArray(o.g) || !Array.isArray(o.t) || !Array.isArray(o.i) || !Array.isArray(o.r) || o.c !== 0 && o.c !== 1) {
    throw new Error("stored rows are malformed");
  }
  const full = (u) => typeof u === "string" ? o.p + u : null;
  const items = o.i.map((r) => {
    if (!Array.isArray(r) || r.length !== 10 || typeof r[0] !== "string" || typeof o.t[r[5]] !== "string" || !isIndexList(r[6], o.g.length)) {
      throw new Error("stored item is malformed");
    }
    return {
      id: r[0],
      title: asText(r[1]),
      poster: full(r[2]),
      backdrop: full(r[3]),
      durationS: Number(r[4]) || 0,
      type: o.t[r[5]],
      genres: r[6].map((g) => asText(o.g[g])),
      score: typeof r[7] === "number" ? r[7] : null,
      description: asText(r[8]),
      shelvedAtMs: (Number(r[9]) || 0) * 1e3
    };
  });
  const rows = o.r.map((r) => {
    if (!Array.isArray(r) || typeof r[0] !== "string" || typeof r[1] !== "string" || !isIndexList(r[2], items.length)) {
      throw new Error("stored row is malformed");
    }
    return { id: r[0], title: r[1], shown: r[2].map((k) => items[k]), all: null };
  });
  return { rows, complete: o.c === 1 };
}
function splitParts(text2, budget = PART_BUDGET_BYTES) {
  const parts = [];
  let start = 0;
  while (start < text2.length) {
    let len = Math.min(budget, text2.length - start);
    for (; ; ) {
      let end = start + len;
      const c = text2.charCodeAt(end - 1);
      if (end < text2.length && c >= 55296 && c < 56320) end--;
      const size = storedLength(text2.slice(start, end));
      if (size <= budget || end - start <= 1) {
        len = end - start;
        break;
      }
      len = Math.max(1, Math.min(end - start - 1, Math.floor((end - start) * budget / size) - 2));
    }
    parts.push(text2.slice(start, start + len));
    start += len;
  }
  return parts.length === 0 ? [""] : parts;
}
function checksum(text2) {
  let h = 2166136261;
  for (let k = 0; k < text2.length; k++) {
    h ^= text2.charCodeAt(k);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(36);
}
function makeRowsStore({ kino: kino2, ttlMs }) {
  const partKey = (n) => `${PART_PREFIX}${n}`;
  const isPartKey = (k) => k.startsWith(PART_PREFIX) && /^\d+$/.test(k.slice(PART_PREFIX.length));
  const digest = (text2) => {
    try {
      const h = kino2.crypto.hash("md5", text2);
      if (typeof h === "string" && h !== "") return { m: h };
    } catch (_) {
    }
    return { h: checksum(text2) };
  };
  const ROOT_NAMES = ["peliculas", "series", "anime", "infantil"];
  function read() {
    try {
      const rawMeta = kino2.storage.get(META_KEY);
      if (rawMeta === null || rawMeta === void 0) return null;
      const m = JSON.parse(rawMeta);
      if (m === null || typeof m !== "object" || m.v !== ROWS_FORMAT || typeof m.g !== "string" || !Number.isInteger(m.n) || m.n < 1 || m.n > 64 || !Number.isInteger(m.len) || typeof m.h !== "string" && typeof m.m !== "string" || !Number.isFinite(m.at)) return null;
      const tag = m.g + ":";
      let text2 = "";
      for (let n = 0; n < m.n; n++) {
        const part = kino2.storage.get(partKey(n));
        if (typeof part !== "string" || !part.startsWith(tag)) return null;
        text2 += part.slice(tag.length);
      }
      if (text2.length !== m.len) return null;
      if (typeof m.m === "string" ? digest(text2).m !== m.m : checksum(text2) !== m.h) return null;
      const { rows, complete } = decodeRows(text2);
      let roots;
      if (m.r === void 0) roots = Object.fromEntries(ROOT_NAMES.map((r) => [r, m.at]));
      else if (m.r !== null && typeof m.r === "object" && Object.entries(m.r).every(([k, t]) => ROOT_NAMES.includes(k) && Number.isFinite(t))) roots = m.r;
      else return null;
      let whole2;
      if (m.w === void 0) whole2 = complete ? Object.keys(roots) : [];
      else if (Array.isArray(m.w) && m.w.every((r) => ROOT_NAMES.includes(r))) whole2 = m.w;
      else return null;
      return { rows, complete, at: m.at, roots, whole: whole2 };
    } catch (_) {
      return null;
    }
  }
  function write(text2, at, roots, whole2) {
    const sum = digest(text2);
    const gen = (Math.floor(at) % 2176782336).toString(36) + String(sum.m ?? sum.h).slice(0, 4);
    const parts = splitParts(text2, PART_BUDGET_BYTES - PART_TAG_BYTES);
    let keys = [];
    try {
      keys = kino2.storage.keys();
    } catch (_) {
    }
    for (const k of keys) {
      if (k === META_KEY || k.startsWith("tree:") || isPartKey(k) && Number(k.slice(PART_PREFIX.length)) >= parts.length) {
        try {
          kino2.storage.remove(k);
        } catch (_) {
        }
      }
    }
    try {
      parts.forEach((p, n) => kino2.storage.set(partKey(n), `${gen}:${p}`, { ttlMs }));
      kino2.storage.set(META_KEY, JSON.stringify({ v: ROWS_FORMAT, g: gen, n: parts.length, len: text2.length, ...sum, at, r: roots, w: whole2 }), { ttlMs });
      return true;
    } catch (e) {
      for (let n = 0; n < parts.length; n++) {
        try {
          kino2.storage.remove(partKey(n));
        } catch (_) {
        }
      }
      throw e;
    }
  }
  return { read, write };
}

// src/byteCache.js
function makeByteCache({ kino: kino2, key, budgetBytes, clock: clock2, ttlMs, valid: valid2 = () => true, keepMs = ttlMs }) {
  const what = String(key).split(":")[0];
  const decode2 = (raw) => {
    try {
      const o = JSON.parse(raw);
      if (!isObject(o) || o.v !== 1 || !Array.isArray(o.e)) return [];
      return o.e.filter((x) => isObject(x) && typeof x.k === "string" && Number.isFinite(x.s) && x.i !== void 0 && valid2(x.i));
    } catch (_) {
      return [];
    }
  };
  const encode2 = (entries) => JSON.stringify({ v: 1, e: entries });
  function read() {
    try {
      const raw = kino2.storage.get(key);
      return raw === null || raw === void 0 ? [] : decode2(raw);
    } catch (_) {
      return [];
    }
  }
  const fresh = (entry, nowMs) => nowMs - entry.s < ttlMs;
  function get(k, entries = read(), nowMs = clock2.now()) {
    const hit = entries.find((e) => e.k === k && fresh(e, nowMs));
    return hit === void 0 ? void 0 : hit.i;
  }
  const kept = (entry, nowMs) => nowMs - entry.s < Math.max(ttlMs, keepMs);
  function getStale(k, entries = read(), nowMs = clock2.now()) {
    const hit = entries.find((e) => e.k === k && kept(e, nowMs));
    return hit === void 0 ? void 0 : hit.i;
  }
  function write(added, touched = []) {
    try {
      const now = clock2.now();
      let entries = read().filter((e) => kept(e, now));
      for (const k of touched) {
        const at = entries.findIndex((e) => e.k === k);
        if (at >= 0) entries.push(...entries.splice(at, 1));
      }
      for (const a of added) {
        const entry = { k: a.k, s: now, i: a.i };
        if (storedLength(encode2([entry])) > budgetBytes) {
          trace(kino2, "store", "skip", { what });
          continue;
        }
        entries = entries.filter((e) => e.k !== a.k);
        entries.push(entry);
      }
      let text2 = encode2(entries);
      let evicted = 0;
      while (storedLength(text2) > budgetBytes && entries.length > 0) {
        entries.shift();
        evicted++;
        text2 = encode2(entries);
      }
      if (evicted > 0) trace(kino2, "store", "evict", { what, n: evicted });
      if (entries.length === 0) return;
      kino2.storage.set(key, text2);
    } catch (e) {
      trace(kino2, "store", "full", { what, code: errCode(e) });
    }
  }
  return { read, get, getStale, fresh, write };
}

// src/seasonTag.js
var B = "(?<![\\p{L}\\p{N}_])";
var E = "(?![\\p{L}\\p{N}_])";
var SEASON_SOURCE = `(?:${B}T\\s?([0-9]{1,2})${E}|${B}Temp\\.?\\s?([0-9]{1,2})${E}|${B}Temporada\\s?([0-9]{1,2})${E}|${B}S([0-9]{1,2})${E})`;

// src/titleClean.js
var B2 = "(?<![\\p{L}\\p{N}_])";
var E2 = "(?![\\p{L}\\p{N}_])";
var LANGUAGE = new RegExp(
  `${B2}(?:audio\\s+)?(?:espa[\xF1n]ol(?:\\s+latino)?|castellano|latino|latam|subtitulad[oa]|doblad[oa]|dual|sub(?:\\s+esp)?|hd|4k|\\d{3,4}p)${E2}`,
  "giu"
);
var SEASON = new RegExp(SEASON_SOURCE, "giu");
var BRACKETS = /[([{][^)\]}]*[)\]}]/g;
function cleanSeriesTitle(title2) {
  if (typeof title2 !== "string") return "";
  const t = title2.replace(BRACKETS, " ").replace(SEASON, " ").replace(LANGUAGE, " ").replace(/[\s_.:;,|/\\-]+/g, " ").trim();
  return t.length >= 2 ? t : "";
}
var ENDS_IN_DIGIT = /[0-9]\s*$/;
var tails = null;
function tailRegexes() {
  if (tails === null) {
    const tags = `(?:${B2}audio\\s+(?:latino|espa[\xF1n]ol|castellano)|${B2}espa[\xF1n]ol(?:\\s+latino)?|${B2}castellano|${B2}subtitulad[oa]|${B2}doblad[oa]|${B2}hd|${B2}4k|${B2}\\d{3,4}p)${E2}`;
    tails = {
      tags: new RegExp(`(?:[\\s_.:;,|/\\\\-]*${tags})+[\\s_.:;,|/\\\\-]*$`, "iu"),
      season: new RegExp(`(?:[\\s_.:;,|/\\\\-]*)${SEASON_SOURCE}\\s*$`, "iu")
    };
  }
  return tails;
}
function displaySeriesTitle(title2) {
  if (typeof title2 !== "string") return "";
  if (!ENDS_IN_DIGIT.test(title2)) return title2;
  const { tags, season } = tailRegexes();
  const m = season.exec(title2);
  if (!m) return title2;
  const rest = title2.slice(0, m.index).replace(tags, "").replace(/[\s_.:;,|/\\-]+$/g, "").trim();
  return rest.length >= 2 ? rest : title2;
}

// src/search.js
var ITEM_ID = /^[A-Za-z0-9._~-]{1,128}$/;
var MAX_OUTPUT_ITEMS = 100;
var MAX_ALT_TITLES = 5;
var MAX_SPANISH_FORMS = 3;
var MAX_FULL_TITLE_RETRIES = 4;
var PAGE_SIZE = 20;
var PORTAL_SHARE_MS = 6e3;
var CACHE_KEY = "search:v1";
var CACHE_BUDGET_BYTES = 24e3;
var CACHE_FRESH_MS = 6 * 36e5;
function seasonFromName(name) {
  const m = new RegExp(SEASON_SOURCE, "iu").exec(typeof name === "string" ? name : "");
  if (!m) return 1;
  const digits = m.slice(1).find((g) => g !== void 0 && g.trim() !== "");
  return digits === void 0 ? 1 : Number(digits);
}
var withoutSeason = (name) => (typeof name === "string" ? name : "").replace(new RegExp(SEASON_SOURCE, "giu"), "").trim().toLowerCase();
function sortSeasons(items) {
  const slots = [];
  items.forEach((it, i) => {
    if (isSeries(it.p)) slots.push(i);
  });
  if (slots.length < 2) return items;
  const order = /* @__PURE__ */ new Map();
  for (const i of slots) {
    const key = withoutSeason(items[i].t);
    if (!order.has(key)) order.set(key, order.size);
  }
  const sorted = slots.map((i) => items[i]).sort((a, b) => order.get(withoutSeason(a.t)) - order.get(withoutSeason(b.t)) || seasonFromName(a.t) - seasonFromName(b.t));
  const out = items.slice();
  slots.forEach((i, pos) => {
    out[i] = sorted[pos];
  });
  return out;
}
var seriesKey = (name) => String(name).toLowerCase().normalize("NFD").replace(/\p{Mn}+/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
function collapseSeasons(items, read) {
  const best = /* @__PURE__ */ new Map();
  items.forEach((it, i) => {
    const { title: title2, series } = read(it);
    if (!series) return;
    const shown = displaySeriesTitle(title2);
    if (shown === title2) return;
    const key = seriesKey(shown);
    const season = seasonFromName(title2);
    const cur = best.get(key);
    if (cur === void 0 || season < cur.season) best.set(key, { index: i, season });
  });
  if (best.size === 0) return items;
  return items.filter((it, i) => {
    const { title: title2, series } = read(it);
    if (!series) return true;
    const shown = displaySeriesTitle(title2);
    if (shown === title2) return true;
    return best.get(seriesKey(shown)).index === i;
  });
}
var str3 = (v) => typeof v === "string" ? v : "";
var INT3 = /^[+-]?\d+$/;
var ADULT_TAG = "adult";
var taggedAdult = (tags) => str3(tags).split(",").some((t) => t.trim().toLowerCase() === ADULT_TAG);
function wholeNumberOrNull(v) {
  if (typeof v === "number") return Number.isInteger(v) ? v : null;
  if (typeof v === "string" && INT3.test(v)) {
    const n = Number(v);
    return n >= -2147483648 && n <= 2147483647 ? n : null;
  }
  return null;
}
function slim(raw) {
  if (!isObject(raw)) return null;
  const c = str3(raw.contentId);
  if (c.trim() === "") return null;
  const alias = str3(raw.alias);
  const t = [raw.name, raw.viewPoint, raw.alias].map(str3).find((s) => s.trim() !== "") ?? "";
  const out = { c, t };
  if (alias !== t && alias.trim() !== "") out.a = alias;
  const programType = str3(raw.programType).trim() === "" ? "movie" : str3(raw.programType);
  if (programType !== "movie") out.p = programType;
  const year = str3(raw.releaseTime).slice(0, 4);
  if (/^[0-9]{4}$/.test(year)) out.y = year;
  const n = wholeNumberOrNull(raw.volumnCount) ?? wholeNumberOrNull(raw.updateCount) ?? 0;
  if (n !== 0) out.n = n;
  if (taggedAdult(raw.tags)) out.x = 1;
  if (Array.isArray(raw.posterList)) {
    for (const p of raw.posterList) {
      if (!isObject(p)) continue;
      const key = p.fileType === "icon" ? "m" : p.fileType === "poster" ? "b" : null;
      const url = str3(p.fileUrl);
      if (key !== null && url.trim() !== "" && out[key] === void 0) out[key] = url;
    }
  }
  return out;
}
var eachObject = (list, f) => {
  if (Array.isArray(list)) {
    for (const x of list) if (isObject(x)) f(x);
  }
};
function flatten(response) {
  const out = [];
  if (isObject(response)) {
    eachObject(response.searchItemList, (group) => eachObject(group.itemList, (x) => out.push(x)));
    if (out.length === 0) eachObject(Array.isArray(response.assetList) ? response.assetList : response.list, (x) => out.push(x));
  }
  return out;
}
var validEntryItems = (items) => Array.isArray(items) && items.every((it) => isObject(it) && typeof it.c === "string" && typeof it.t === "string");
var intOr0 = (v) => typeof v === "number" && Number.isFinite(v) ? Math.trunc(v) : 0;
var distinctBy2 = (list, keyOf) => {
  const seen = /* @__PURE__ */ new Set();
  return list.filter((x) => {
    const k = keyOf(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};
function makeSearch({ kino: kino2, portal, session, clock: clock2, tmdb = null, isAdultId = () => false, idsLookup = () => () => null }) {
  const surface = (e) => {
    if (e instanceof PortalError) return mapPortalError(e.code, e.message, kino2);
    if (isKinoError(e)) return e;
    return kino2.error("unavailable", "Xuper no est\xE1 disponible ahora");
  };
  const cache = makeByteCache({ kino: kino2, key: CACHE_KEY, budgetBytes: CACHE_BUDGET_BYTES, clock: clock2, ttlMs: CACHE_FRESH_MS, valid: validEntryItems });
  function contextOf(query) {
    const q = isObject(query) ? query : {};
    const rawType = typeof q.type === "string" ? q.type.trim() : "";
    return {
      q: typeof q.q === "string" ? q.q.trim() : "",
      type: rawType === "" ? "movie" : rawType === "series" ? "tv" : rawType,
      season: intOr0(q.season),
      episode: intOr0(q.episode),
      tmdbId: intOr0(q.tmdbId),
      originalTitle: typeof q.originalTitle === "string" ? q.originalTitle : "",
      altTitles: Array.isArray(q.altTitles) ? q.altTitles.filter((s) => typeof s === "string").slice(0, MAX_ALT_TITLES) : []
    };
  }
  async function titleForms(ctx, deadline) {
    const forms = [ctx.q];
    if (ctx.tmdbId > 0 && tmdb) {
      let detail = null;
      try {
        detail = await tmdb.titleForms(ctx.type === "movie" ? "movie" : "tv", ctx.tmdbId, { deadline: deadline - PORTAL_SHARE_MS });
      } catch (_) {
        detail = null;
      }
      if (detail) {
        for (const t of [detail.title, detail.originalTitle, detail.englishTitle]) if (typeof t === "string" && t.trim() !== "") forms.push(t);
        for (const t of (Array.isArray(detail.spanishTitles) ? detail.spanishTitles : []).slice(0, MAX_SPANISH_FORMS)) forms.push(t);
      }
    }
    for (const t of [ctx.originalTitle, ...ctx.altTitles]) if (t.trim() !== "") forms.push(t);
    return distinctBy2(forms, (f) => f.trim().toLowerCase());
  }
  async function search2(query) {
    const deadline = callDeadline(clock2, CALL_BUDGET_MS.search);
    const ctx = contextOf(query);
    if (ctx.q === "") return [];
    const forms = await titleForms(ctx, deadline);
    const queries = distinctBy2(forms.map((f) => kino2.rank.shortQuery(f)), (f) => f.toLowerCase());
    const entries = cache.read();
    const nowMs = clock2.now();
    const touched = [];
    const added = [];
    const seen = /* @__PURE__ */ new Set();
    const pool = [];
    let lastError = null;
    let ensuring = null;
    async function portalItems(q) {
      ensuring ?? (ensuring = session.ensure({ deadline }));
      await ensuring;
      const response = await session.withValidSession((v) => portal.call(
        "v3/searchByName",
        { value: q, type: "0", columnId: "", filter: "", pageNum: 1, pageSize: PAGE_SIZE },
        viewOpts(v)
      ), { seedFallback: true, deadline });
      return flatten(response).map(slim).filter((x) => x !== null);
    }
    async function fetchInto(qs) {
      for (const q of qs) {
        const key = q.toLowerCase();
        let part = null;
        const hit = cache.get(key, entries, nowMs);
        if (hit !== void 0) {
          part = hit;
          touched.push(key);
        } else {
          try {
            part = await portalItems(q);
            if (part.length > 0) added.push({ k: key, i: part });
          } catch (e) {
            lastError = e;
            part = null;
          }
        }
        if (part) {
          for (const item of part) if (!seen.has(item.c)) {
            seen.add(item.c);
            pool.push(item);
          }
        }
      }
    }
    const titlesOf = (item) => [item.t, item.a ?? ""];
    const ranked = () => kino2.rank.filterRelevant(kino2.rank.sortBySimilarity(pool, forms, titlesOf), forms, titlesOf);
    let items;
    try {
      await fetchInto(queries);
      if (pool.length === 0 && lastError !== null) throw surface(lastError);
      items = ranked();
      if (items.length === 0) {
        const asked = new Set(queries.map((s) => s.trim().toLowerCase()));
        const full = distinctBy2(
          forms.map((f) => f.trim()).filter((f) => f !== "" && !asked.has(f.toLowerCase())),
          (f) => f.toLowerCase()
        ).slice(0, MAX_FULL_TITLE_RETRIES);
        if (full.length > 0) {
          await fetchInto(full);
          items = ranked();
        }
      }
    } finally {
      if (added.length > 0 || touched.length > 0) cache.write(added, touched);
    }
    if ((ctx.type === "tv" || ctx.type === "anime") && ctx.season > 0) {
      const matching = items.filter((it) => !isSeries(it.p ?? "movie") || seasonFromName(it.t) === ctx.season);
      if (matching.length > 0) items = matching;
    }
    if (items.length === 0 && ctx.tmdbId > 0) trace(kino2, "search", "empty", { type: ctx.type, pool: pool.length });
    const out = [];
    let idsOf;
    try {
      idsOf = idsLookup();
    } catch (_) {
      idsOf = () => null;
    }
    const ordered = sortSeasons(items);
    const listed = ctx.season > 0 ? ordered : collapseSeasons(ordered, (it) => ({ title: it.t, series: isSeries(it.p ?? "movie") }));
    for (const it of listed) {
      if (!ITEM_ID.test(it.c)) continue;
      const programType = it.p ?? "movie";
      const series = isSeries(programType);
      const item = {
        id: it.c,
        ref: encode({ contentId: it.c, programType, episode: ctx.episode }),
        title: it.t.trim() === "" ? it.c : series ? displaySeriesTitle(it.t) : it.t,
        kind: series ? "series" : "movie",
        year: it.y ?? "",
        season: series ? seasonFromName(it.t) : ctx.season,
        episodeCount: it.n ?? 0
      };
      if (it.m) item.poster = it.m;
      if (it.b) item.backdrop = it.b;
      let adult = it.x === 1;
      if (!adult) {
        try {
          adult = isAdultId(it.c) === true;
        } catch (_) {
          adult = false;
        }
      }
      if (adult) item.adult = true;
      const ids = idsOf(it.c);
      if (ids) item.ids = ids;
      out.push(item);
      if (out.length >= MAX_OUTPUT_ITEMS) break;
    }
    return out;
  }
  return { search: search2 };
}

// src/episodes.js
var CACHE_KEY2 = "chapters:v1";
var CACHE_BUDGET_BYTES2 = 32e3;
var CACHE_FRESH_MS2 = 6 * 36e5;
var CACHE_KEEP_MS = 7 * 24 * 36e5;
var CHAPTERS_REFRESH_MS = 8e3;
var CHAPTERS_COLD_MS = 12e3;
var EPISODES_DEADLINE_MS = 15e3;
var IMDB = /^tt\d{7,}$/;
var MAX_EPISODES = 5e3;
var MAX_SEASONS = 50;
var INT4 = /^[+-]?\d+$/;
var GENERIC_TITLE = /^(?:(?:capitulo|episodio|chapter|episode|cap|ep|e)\.?\s*#?\s*)?\d*$/;
var TRAILING_NUMBER = /[\s._-]*\d+$/;
var plainTitle = (s) => s.toLowerCase().normalize("NFD").replace(/\p{Mn}+/gu, "").replace(/\s+/g, " ").trim();
function isGenericTitle(s) {
  if (typeof s !== "string") return true;
  const t = plainTitle(s);
  if (GENERIC_TITLE.test(t)) return true;
  const cut = t.lastIndexOf("_");
  if (cut < 0) return false;
  const series = t.slice(0, cut).trim();
  const rest = t.slice(cut + 1).trim();
  return GENERIC_TITLE.test(rest) || TRAILING_NUMBER.test(rest) && rest.replace(TRAILING_NUMBER, "").trim() === series;
}
function toIntOrNull2(v) {
  const text2 = typeof v === "string" ? v : typeof v === "number" ? String(v) : null;
  if (text2 === null || !INT4.test(text2)) return null;
  const n = Number(text2);
  return n >= -2147483648 && n <= 2147483647 ? n || 0 : null;
}
function parseSeasonList(list, ownId) {
  let own = null;
  const all = [];
  const entries = Array.isArray(list) ? list : [];
  for (const entry of entries) {
    if (!isObject(entry)) continue;
    const id = optStringStrict(entry.contentId);
    const number = toIntOrNull2(entry.seasonNumber);
    if (id === ownId) own = number;
    if (id.trim() !== "" && number !== null) all.push({ id, number });
  }
  if (own === null && entries.length === 0) own = 1;
  all.sort((a, b) => a.number - b.number);
  return { own, all };
}
function findChapter(items, episode) {
  if (episode <= 0) return items[0];
  return items.find((it) => typeof it.seriesNumber === "string" && it.seriesNumber.trim() === String(episode));
}
var validPayload = (p) => isObject(p) && typeof p.i === "string" && Array.isArray(p.a) && Array.isArray(p.e) && p.e.every((x) => Array.isArray(x) && typeof x[1] === "string" && typeof x[2] === "string") && p.a.every((x) => Array.isArray(x) && typeof x[0] === "string" && Number.isInteger(x[1])) && (p.s === null || Number.isInteger(p.s)) && (p.d === null || Number.isInteger(p.d)) && (p.t === void 0 || typeof p.t === "string");
function pack(raw) {
  return {
    i: raw.imdb,
    s: raw.season,
    d: raw.declared,
    ...raw.title ? { t: raw.title } : {},
    a: raw.seasons.map((x) => [x.id, x.number]),
    e: raw.items.map((it) => it.duration === void 0 ? [it.seriesNumber, it.contentId, it.name] : [it.seriesNumber, it.contentId, it.name, it.duration])
  };
}
var unpack = (p) => ({
  items: p.e.map((x) => ({ seriesNumber: x[0], contentId: x[1], name: x[2], duration: x[3] })),
  imdb: p.i,
  season: p.s,
  declared: p.d,
  seasons: p.a.map((x) => ({ id: x[0], number: x[1] })),
  title: typeof p.t === "string" ? p.t : ""
});
function makePortalChapters({ kino: kino2, portal, session, clock: clock2, onServed = () => {
}, ids = null }) {
  const cache = makeByteCache({
    kino: kino2,
    key: CACHE_KEY2,
    budgetBytes: CACHE_BUDGET_BYTES2,
    clock: clock2,
    ttlMs: CACHE_FRESH_MS2,
    keepMs: CACHE_KEEP_MS,
    valid: validPayload
  });
  async function fetchDetail(seriesId, deadline) {
    let response;
    try {
      await session.ensure({ deadline });
      response = await session.withValidSession((v) => portal.call(
        "v4/getItemData",
        { contentId: seriesId, type: "0", sortType: "0", language: "en", macAddr: FIXED_MAC },
        viewOpts(v)
      ), { seedFallback: true, deadline });
    } catch (e) {
      if (e instanceof PortalError) throw mapPortalError(e.code, e.message, kino2);
      if (isKinoError(e)) throw e;
      throw kino2.error("unavailable", "Xuper no est\xE1 disponible ahora");
    }
    const data = isObject(response) ? response.assetData : void 0;
    if (!isObject(data)) throw kino2.error("unavailable", "Xuper devolvi\xF3 una cap\xEDtulos sin datos");
    return data;
  }
  return async function portalChapters(seriesId, deadline = callDeadline(clock2, CALL_BUDGET_MS.episodes)) {
    const entries = cache.read();
    const cached = cache.get(seriesId, entries);
    if (cached !== void 0) {
      onServed("cache");
      return unpack(cached);
    }
    const kept = cache.getStale(seriesId, entries);
    const portalEnd = Math.min(deadline, clock2.now() + (kept !== void 0 ? CHAPTERS_REFRESH_MS : CHAPTERS_COLD_MS));
    let data;
    try {
      data = await fetchDetail(seriesId, portalEnd);
    } catch (e) {
      if (kept !== void 0 && isKinoError(e) && e.name === "KinoError_unavailable") {
        trace(kino2, "episodes", "kept", { code: errCode(e) });
        onServed("cache");
        return unpack(kept);
      }
      throw slowPortal(kino2, e);
    }
    const items = (Array.isArray(data.simpleProgramList) ? data.simpleProgramList : []).filter(isObject).map((it) => {
      const seriesNumber = typeof it.seriesNumber === "string" ? it.seriesNumber : typeof it.seriesNumber === "number" ? String(it.seriesNumber) : null;
      const item = { seriesNumber, contentId: optStringStrict(it.contentId), name: optStringStrict(it.name), duration: void 0 };
      if (typeof it.duration === "string" || typeof it.duration === "number" && Number.isFinite(it.duration)) item.duration = it.duration;
      return item;
    });
    const seasonList = parseSeasonList(data.sameSeasonSeriesList, seriesId);
    const title2 = [data.name, data.viewPoint, data.alias].find((v) => typeof v === "string" && v.trim() !== "") ?? "";
    const raw = { items, imdb: optStringStrict(data.keyWords), season: seasonList.own, declared: toIntOrNull2(data.volumnCount), seasons: seasonList.all, title: title2 };
    if (items.length > 0) cache.write([{ k: seriesId, i: pack(raw) }]);
    if (ids) {
      ids.remember(seriesId, raw.imdb);
      if (IMDB.test(raw.imdb)) ids.rememberSeasons(raw.seasons, raw.imdb);
    }
    onServed("fresh");
    return raw;
  };
}
function makeEpisodes({ kino: kino2, tmdb = null, portalChapters, clock: clock2 = null, ids = null }) {
  async function enrich(raw, bounds, byTitle = null) {
    const none = { extra: /* @__PURE__ */ new Map(), series: null };
    if (!tmdb || raw.season === null) return none;
    const viaImdb = IMDB.test(raw.imdb);
    if (!viaImdb && !byTitle) return none;
    try {
      const series = viaImdb ? await tmdb.seriesByImdb(raw.imdb, bounds) : byTitle;
      if (!series) return none;
      const fromTmdb = await tmdb.seasonEpisodes(series.tmdbId, raw.season, void 0, bounds);
      if (!fromTmdb) return { extra: /* @__PURE__ */ new Map(), series };
      const expected = raw.declared !== null && raw.declared > 0 ? raw.declared : raw.items.length;
      if (expected !== fromTmdb.length) return { extra: /* @__PURE__ */ new Map(), series };
      const rows = /* @__PURE__ */ new Map();
      for (const c of fromTmdb) {
        const row2 = {
          still: c.still.trim() !== "" ? c.still : null,
          // TMDB's blank name reads "Episodio N" (parseSeasonEpisodes): no better than the portal's.
          title: !isGenericTitle(c.name) ? c.name : null,
          overview: c.overview.trim() !== "" ? c.overview : null,
          airDate: c.airDate || null,
          runtimeMinutes: c.runtimeMinutes > 0 ? c.runtimeMinutes : null
        };
        if (Object.values(row2).some((v) => v !== null)) rows.set(c.episode, row2);
        else rows.delete(c.episode);
      }
      const missing = new Set([...rows].filter(([, r]) => r.overview === null).map(([n]) => n));
      if (missing.size === 0) return { extra: rows, series };
      let inEnglish = [];
      try {
        inEnglish = await tmdb.seasonEpisodes(series.tmdbId, raw.season, "en-US", bounds) ?? [];
      } catch (_) {
        inEnglish = [];
      }
      for (const c of inEnglish) {
        if (missing.has(c.episode) && c.overview.trim() !== "") rows.set(c.episode, { ...rows.get(c.episode), overview: c.overview });
      }
      return { extra: rows, series };
    } catch (_) {
      return none;
    }
  }
  return async function episodes2(ref) {
    const magis = decode(ref);
    if (!magis) throw kino2.error("unavailable", "ese ref no es de Xuper: no se pueden listar cap\xEDtulos");
    const deadline = clock2 ? Math.min(clock2.now() + EPISODES_DEADLINE_MS, callDeadline(clock2, CALL_BUDGET_MS.episodes)) : void 0;
    let raw;
    try {
      raw = await portalChapters(magis.contentId, deadline);
    } catch (e) {
      if (isKinoError(e) && isEpisodeGone(e.userMessage)) throw mapPortalError("portal100006", "", kino2, { goneMessage: SERIES_GONE });
      throw e;
    }
    let byTitle = null;
    if (!IMDB.test(raw.imdb) && tmdb && typeof tmdb.seriesByTitle === "function") {
      const clean = cleanSeriesTitle(raw.title);
      if (clean !== "") {
        try {
          byTitle = await tmdb.seriesByTitle(clean, { deadline });
        } catch (_) {
          byTitle = null;
        }
      }
    }
    const { extra, series } = await enrich(raw, { deadline }, byTitle);
    if (ids) {
      if (IMDB.test(raw.imdb)) {
        ids.remember(magis.contentId, raw.imdb, series?.tmdbId ?? 0);
        ids.rememberSeasons(raw.seasons, raw.imdb, series?.tmdbId ?? 0);
      } else if (byTitle) {
        ids.remember(magis.contentId, "", byTitle.tmdbId);
        ids.rememberSeasons(raw.seasons, "", byTitle.tmdbId);
      }
    }
    const list = raw.items.slice(0, MAX_EPISODES).map((it) => {
      const number = toIntOrNull2(it.seriesNumber) ?? 0;
      const numbered = number > 0 && it.name.includes("_") && isGenericTitle(it.name);
      const ep = {
        number,
        title: it.name.trim() !== "" && !numbered ? it.name : say(kino2, "chapterN", { n: number }),
        // The series plus the number: whoever plays it looks the chapter back up in the list.
        ref: encodeChapter(number, magis.contentId)
      };
      const t = extra.get(number);
      if (t?.title && isGenericTitle(it.name)) ep.title = t.title;
      if (t?.still) ep.still = t.still;
      if (t?.overview) ep.overview = t.overview;
      if (t?.airDate) ep.airDate = t.airDate;
      if (t?.runtimeMinutes) ep.runtimeMinutes = t.runtimeMinutes;
      if (raw.season !== null) ep.season = raw.season;
      return ep;
    });
    const out = { episodes: list };
    if (IMDB.test(raw.imdb)) {
      const tmdbId = series?.tmdbId ?? 0;
      out.series = {
        ids: tmdbId > 0 ? { imdb: raw.imdb, tmdb: tmdbId } : { imdb: raw.imdb },
        title: series?.title ?? "",
        poster: series?.poster ?? "",
        backdrop: series?.backdrop ?? ""
      };
    } else if (byTitle) {
      out.series = { ids: { tmdb: byTitle.tmdbId }, title: byTitle.title, poster: byTitle.poster, backdrop: byTitle.backdrop };
    }
    if (raw.seasons.length > 0) {
      out.seasons = raw.seasons.slice(0, MAX_SEASONS).map((s) => ({
        id: s.id,
        // A season IS a portal title of the same kind: its ref is what a search would give it.
        ref: encode({ contentId: s.id, programType: magis.programType, episode: 0 }),
        title: say(kino2, "seasonN", { n: s.number }),
        number: s.number,
        current: s.id === magis.contentId
      }));
    }
    return out;
  };
}

// src/idsStore.js
var KEY2 = "ids:v1";
var BUDGET_BYTES = 1e4;
var KEEP_MS = 60 * 24 * 36e5;
var IMDB2 = /^tt\d{7,10}$/;
var MAX_TMDB = 2147483647;
var validTmdb = (n) => Number.isInteger(n) && n > 0 && n <= MAX_TMDB;
var valid = (p) => Array.isArray(p) && typeof p[0] === "string" && Number.isInteger(p[1]) && p[1] >= 0 && (IMDB2.test(p[0]) || p[0] === "" && validTmdb(p[1]));
var idsOfPayload = (p) => {
  if (!valid(p)) return null;
  if (p[0] === "") return { tmdb: p[1] };
  return validTmdb(p[1]) ? { imdb: p[0], tmdb: p[1] } : { imdb: p[0] };
};
function makeIdsStore({ kino: kino2, clock: clock2 }) {
  const cache = makeByteCache({ kino: kino2, key: KEY2, budgetBytes: BUDGET_BYTES, clock: clock2, ttlMs: KEEP_MS, valid });
  function rememberSeasons(siblings, imdb, tmdb = 0) {
    try {
      for (const s of Array.isArray(siblings) ? siblings : []) if (s && typeof s.id === "string") remember(s.id, imdb, tmdb);
    } catch (_) {
    }
  }
  function remember(contentId, imdb, tmdb = 0) {
    try {
      if (typeof contentId !== "string" || contentId.trim() === "" || typeof imdb !== "string") return;
      if (!IMDB2.test(imdb) && !(imdb === "" && validTmdb(tmdb))) return;
      const entries = cache.read();
      const old = cache.get(contentId, entries);
      const keptTmdb = validTmdb(tmdb) ? tmdb : old && old[0] === imdb ? old[1] : 0;
      if (old && old[0] === imdb && old[1] === keptTmdb) return;
      cache.write([{ k: contentId, i: [imdb, keptTmdb] }]);
    } catch (_) {
    }
  }
  function lookup() {
    let byId;
    try {
      byId = new Map(cache.read().map((e) => [e.k, e.i]));
    } catch (_) {
      byId = /* @__PURE__ */ new Map();
    }
    return (contentId) => byId.has(contentId) ? idsOfPayload(byId.get(contentId)) : null;
  }
  return { remember, rememberSeasons, lookup };
}

// src/liveTiles.js
var LIVE_TILE_PREFIX = "xlive:";
var MAX_LIVE_TILES = 6;
var GENRE_ORDER = ["deportes", "noticias", "infantil", "cineyseries", "peliculas", "series", "entretenimiento", "musica", "documentales", "anime"];
var TITLE_KEY = {
  deportes: "liveTileSports",
  noticias: "liveTileNews",
  infantil: "liveTileKids",
  peliculas: "liveTileMovies",
  cineyseries: "liveTileMoviesSeries",
  series: "liveTileSeries",
  entretenimiento: "liveTileEntertainment",
  musica: "liveTileMusic",
  documentales: "liveTileDocumentaries",
  anime: "liveTileAnime"
};
var LIVE_TILES_COLD_MS = 8e3;
var PAGE_SIZE2 = 100;
var MAX_PAGES = 20;
var isLiveTileRef = (ref) => typeof ref === "string" && ref.startsWith(LIVE_TILE_PREFIX);
function genresOf2(categories2) {
  const by = /* @__PURE__ */ new Map();
  for (const { id, genre } of categories2) {
    if (!Object.hasOwn(TITLE_KEY, genre)) continue;
    if (!by.has(genre)) by.set(genre, []);
    if (!by.get(genre).includes(id)) by.get(genre).push(id);
  }
  return GENRE_ORDER.filter((g) => by.has(g)).map((genre) => ({ genre, ids: by.get(genre) }));
}
function makeLiveTiles({ kino: kino2, live: live2, clock: clock2 }) {
  async function tiles() {
    try {
      const deadline = Math.min(clock2.now() + LIVE_TILES_COLD_MS, callDeadline(clock2, CALL_BUDGET_MS.categories));
      const genres = genresOf2(await live2.genreCategories(deadline)).slice(0, MAX_LIVE_TILES);
      const logos = live2.genreLogos();
      return genres.map(({ genre }) => {
        const tile = { id: `xlive-${genre}`, title: say(kino2, TITLE_KEY[genre]).slice(0, 40), ref: LIVE_TILE_PREFIX + genre };
        if (Object.hasOwn(logos, genre)) tile.art = logos[genre];
        return tile;
      });
    } catch (e) {
      trace(kino2, "categories", "live_tiles_fail", { code: errCode(e) });
      return [];
    }
  }
  const notFound = () => kino2.error("not_found", "No se encontr\xF3 esa categor\xEDa");
  function cursorOf(cursor) {
    const m = typeof cursor === "string" ? /^(\d{1,2})\.(\d{1,3})$/.exec(cursor) : null;
    return m ? { at: Number(m[1]), page: Math.max(1, Number(m[2])) } : { at: 0, page: 1 };
  }
  async function browse2(ref, cursor) {
    const genre = ref.slice(LIVE_TILE_PREFIX.length);
    const deadline = callDeadline(clock2, CALL_BUDGET_MS.browse);
    let ids;
    try {
      ids = genresOf2(await live2.genreCategories(deadline)).find((g) => g.genre === genre)?.ids;
    } catch (e) {
      throw live2.surface(e);
    }
    if (!ids) throw notFound();
    let { at, page } = cursorOf(cursor);
    const first = cursor === null || cursor === void 0;
    while (at < ids.length && page <= MAX_PAGES) {
      let got;
      try {
        got = await live2.channelsPage(ids[at], page, PAGE_SIZE2, deadline);
      } catch (e) {
        if (first && at === 0 && page === 1) throw live2.surface(e);
        trace(kino2, "live", "tile_page_fail", { genre, page, code: errCode(e) });
        return { items: [] };
      }
      const next = got.full && page < MAX_PAGES ? `${at}.${page + 1}` : at + 1 < ids.length ? `${at + 1}.1` : null;
      const items = got.items.map((c) => {
        const item = { kind: "live", id: c.id, title: c.title, ref: c.ref };
        if (c.logo) item.poster = c.logo;
        return item;
      });
      if (items.length > 0 || next === null) return next ? { items, next } : { items };
      ({ at, page } = cursorOf(next));
    }
    return { items: [] };
  }
  return { tiles, browse: browse2 };
}

// src/catalog.js
var ROOT_CODES = { peliculas: "masnew_movies", series: "masnew_series", anime: "masnew_anime", infantil: "masnew_kids" };
var ADULT_ROOT_CODE = "masnew_adult";
var ADULT_REF = "magis_adultos";
var ROWS_FRESH_MS = 2 * 36e5;
var SNAPSHOT_TTL_MS = 14 * 24 * 36e5;
var TREE_PAGE_SIZE = 60;
var REFRESH_GAP_MS = 5 * 6e4;
var SLICE_START_MS = 1500;
var SLICE_MARGIN_MS = 2e3;
var WARM_REFRESH_MS = 8e3;
var COLD_DEADLINE_MS = 12e3;
var LIVE_ROW_MS = WARM_REFRESH_MS;
var COLD_PARALLEL = 2;
var SLOW_FETCH_MS = 4e3;
var SLOW_KEY = "portalSlow";
var SLOW_MEMORY_MS = 30 * 6e4;
var HEAVY_REFRESH_MS = 12e3;
var SLOW_REFRESH_GAP_MS = 30 * 6e4;
var HEAVY_KEY = "refreshHeavy";
var HEAVY_MEMORY_MS = 24 * 36e5;
var REFRESH_AT_KEY = "refreshAt";
var BROWSE_PAGE = 50;
var MAX_HOME_ROWS = 20;
var MAX_ROW_ITEMS = 60;
var MAX_GENRES = 5;
var NEW_WINDOW_MS = 48 * 36e5;
var ITEM_ID2 = /^[A-Za-z0-9._~-]{1,128}$/;
var noIds = () => null;
var oneEach = (items) => collapseSeasons(items, (i) => ({ title: i.title, series: isSeries(i.type) }));
function projectItem(item, nowMs, idsOf = noIds, english = false, spanish = false) {
  if (!ITEM_ID2.test(item.id)) return null;
  const out = {
    id: item.id,
    ref: refOf(item),
    // A season's own tag ("... Español T2") is the portal's bookkeeping: the name is the series (the season rides in `season`).
    title: item.title.trim() === "" ? item.id : isSeries(item.type) ? displaySeriesTitle(item.title) : item.title,
    kind: isSeries(item.type) ? "series" : "movie"
  };
  if (item.poster) out.poster = item.poster;
  if (item.backdrop) out.backdrop = item.backdrop;
  if (item.description.trim() !== "") out.overview = item.description;
  if (item.genres.length > 0) out.genres = item.genres.slice(0, MAX_GENRES).map((g) => genreName(g, spanish));
  if (item.score !== null && Number.isFinite(item.score) && item.score >= 0 && item.score <= 10) out.rating = item.score;
  const minutes = Math.trunc(item.durationS / 60);
  if (minutes >= 1 && minutes <= 1e3) out.runtimeMinutes = minutes;
  if (item.shelvedAtMs > 0 && nowMs - item.shelvedAtMs <= NEW_WINDOW_MS) out.badges = [english ? "NEW" : "NUEVO"];
  const ids = idsOf(item.id);
  if (ids) out.ids = ids;
  return out;
}
var plainWords = (text2) => String(text2).toLowerCase().normalize("NFD").replace(/\p{Mn}+/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
function rankWithin(kino2, pool, q) {
  const words = plainWords(q).split(" ").filter((w) => w !== "");
  const forms = [q];
  const titlesOf = (item) => [item.title];
  const relevant = new Set(kino2.rank.filterRelevant(pool, forms, titlesOf));
  const hits = pool.filter((item) => {
    if (relevant.has(item)) return true;
    const title2 = plainWords(item.title);
    return words.length > 0 && words.every((w) => title2.includes(w));
  });
  return kino2.rank.sortBySimilarity(hits, forms, titlesOf);
}
function projectRows(rows, nowMs, idsOf = noIds, english = false, spanish = false) {
  const out = [];
  for (const r of rows) {
    const items = oneEach(r.shown).map((i) => projectItem(i, nowMs, idsOf, english, spanish)).filter((i) => i !== null).slice(0, MAX_ROW_ITEMS);
    if (items.length === 0) continue;
    const title2 = localizedRowTitle(r, english);
    const genre = genreOfRow(r.id);
    out.push(genre !== null ? { id: r.id, title: title2, ref: r.id, items, genre } : { id: r.id, title: title2, ref: r.id, items });
  }
  return out.slice(0, MAX_HOME_ROWS);
}
var hasItems = (sections) => sections.some((s) => s.items.length > 0);
var INT5 = /^[+-]?\d+$/;
function offsetOf(cursor) {
  if (typeof cursor !== "string" || !INT5.test(cursor)) return 0;
  const n = Number(cursor);
  return n > 0 && n <= 2147483647 ? n : 0;
}
function makeCatalog({ kino: kino2, portal, session, clock: clock2, tmdb = null, countryRow = null }) {
  const store = makeRowsStore({ kino: kino2, ttlMs: SNAPSHOT_TTL_MS });
  const ids = makeIdsStore({ kino: kino2, clock: clock2 });
  const stale = (at) => {
    const age = clock2.now() - at;
    return age < 0 || age >= ROWS_FRESH_MS;
  };
  const trees = /* @__PURE__ */ new Map();
  let current;
  let dirty = false;
  const failedAt = /* @__PURE__ */ new Map();
  function getCurrent() {
    if (current === void 0) {
      const snap = store.read();
      current = snap ? { rows: snap.rows, roots: snap.roots, whole: new Set(snap.whole), withAll: /* @__PURE__ */ new Set() } : null;
    }
    return current;
  }
  function homeRowsCount(rows2) {
    let shown = 0;
    for (let n = 0; n < rows2.length; n++) {
      if (rows2[n].shown.some((i) => ITEM_ID2.test(i.id)) && ++shown >= MAX_HOME_ROWS) return n + 2;
    }
    return rows2.length;
  }
  function save() {
    dirty = false;
    const { rows: rows2, roots } = current;
    if (rows2.length === 0) return;
    const startedAt = clock2.now();
    const keepFull = homeRowsCount(rows2);
    const fit = fitRows(rows2, { keepFull });
    if (fit === null) {
      trace(kino2, "store", "skip", { what: "rows" });
      return;
    }
    if (fit.step > 0) trace(kino2, "store", "trim", { what: "rows", step: fit.step });
    const cut = fit.step === 0 ? /* @__PURE__ */ new Set() : new Set(rows2.slice(keepFull).filter((r) => r.shown.length > 1).map((r) => rootOfRow(r.id)));
    const whole2 = Object.keys(roots).filter((r) => current.whole.has(r) && !cut.has(r));
    try {
      store.write(fit.text, Math.min(...Object.values(roots)), roots, whole2);
      const ms = clock2.now() - startedAt;
      reportIfSlow(kino2, PERF_AREAS.store, "write", ms, { b: msBucket(ms), kb: kbBucket(fit.text.length), step: fit.step });
    } catch (e) {
      trace(kino2, "store", "full", { what: "rows", code: errCode(e) });
    }
  }
  let slowAt = null;
  const portalSlow = () => {
    if (slowAt === null) {
      try {
        const v = Number(kino2.storage.get(SLOW_KEY));
        slowAt = Number.isFinite(v) && v > 0 ? v : 0;
      } catch (_) {
        slowAt = 0;
      }
    }
    const age = clock2.now() - slowAt;
    return slowAt > 0 && age >= 0 && age < SLOW_MEMORY_MS;
  };
  const noteFetchMs = (ms) => {
    const slow = ms >= SLOW_FETCH_MS;
    if (slow === portalSlow()) {
      if (slow) slowAt = clock2.now();
      return;
    }
    slowAt = slow ? clock2.now() : 0;
    try {
      if (slow) kino2.storage.set(SLOW_KEY, String(slowAt), { ttlMs: SLOW_MEMORY_MS });
      else kino2.storage.remove(SLOW_KEY);
    } catch (_) {
    }
  };
  const stampAge = (key) => {
    try {
      const v = Number(kino2.storage.get(key));
      const age = clock2.now() - v;
      return Number.isFinite(v) && v > 0 && age >= 0 ? age : Infinity;
    } catch (_) {
      return Infinity;
    }
  };
  const stamp = (key, ttlMs) => {
    try {
      kino2.storage.set(key, String(clock2.now()), { ttlMs });
    } catch (_) {
    }
  };
  const refreshHeld = () => stampAge(HEAVY_KEY) < HEAVY_MEMORY_MS && stampAge(REFRESH_AT_KEY) < SLOW_REFRESH_GAP_MS;
  const markHeavy = () => stamp(HEAVY_KEY, HEAVY_MEMORY_MS);
  const noteRefresh = (ms) => {
    if (ms >= HEAVY_REFRESH_MS) {
      markHeavy();
      trace(kino2, "home", "heavy_refresh", { b: msBucket(ms) });
      return;
    }
    if (stampAge(HEAVY_KEY) !== Infinity) {
      try {
        kino2.storage.remove(HEAVY_KEY);
      } catch (_) {
      }
    }
  };
  async function fetchRoot(root, deadline) {
    try {
      const response = await session.withValidSession((v) => portal.call(
        "getNextColumns",
        { columnCode: ROOT_CODES[root], pageNum: 1, pageSize: TREE_PAGE_SIZE, version: "" },
        { ...viewOpts(v), onFetchMs: noteFetchMs }
      ), { seedFallback: true, deadline });
      const sections = parseTree(response);
      return { sections: hasItems(sections) ? sections : [], error: null };
    } catch (e) {
      trace(kino2, "home", "root_fail", { root, code: errCode(e) });
      return { sections: [], error: isKinoError(e) ? e : kino2.error("unavailable", "Xuper no est\xE1 disponible ahora") };
    }
  }
  const inflight = /* @__PURE__ */ new Map();
  function sharedFetchRoot(root, deadline) {
    let pending = inflight.get(root);
    if (!pending) {
      pending = fetchRoot(root, deadline).finally(() => inflight.delete(root));
      inflight.set(root, pending);
    }
    return pending;
  }
  const worstOf = (fetched) => (fetched.find((f) => f.error.name !== "KinoError_unavailable") || fetched[0]).error;
  function summarizeFailure(fetched, passes) {
    const codes = [];
    for (const f of [...fetched].sort((a, b) => (a.error.name === "KinoError_unavailable") - (b.error.name === "KinoError_unavailable"))) {
      const c = errCode(f.error);
      if (!codes.includes(c)) codes.push(c);
    }
    const fields = { roots: fetched.length, rounds: passes };
    codes.slice(0, 3).forEach((c, i) => {
      fields["c" + (i + 1)] = c;
    });
    trace(kino2, "home", "all_fail", fields);
  }
  function nextRoot(need, root, asked, refreshing = true) {
    const cur = getCurrent();
    const roots = cur ? cur.roots : {};
    const all = KINDS.map((k) => k.root);
    const required = root !== null && all.includes(root) && (need === "section" ? !(cur && cur.whole.has(root)) : need === "full" ? !(cur && cur.withAll.has(root)) : false) ? [root] : [];
    const missing = all.filter((r) => !(r in roots));
    const stalest = refreshing ? all.filter((r) => r in roots && stale(roots[r])).sort((x, y) => roots[x] - roots[y]) : [];
    const order = [.../* @__PURE__ */ new Set([...required, ...missing, ...stalest])].filter((r) => !asked.has(r));
    const failedRecently = (r) => failedAt.has(r) && clock2.now() - failedAt.get(r) < REFRESH_GAP_MS;
    if (cur) return order.find((r) => !failedRecently(r)) ?? null;
    return [...order].sort((x, y) => (failedAt.get(x) ?? -Infinity) - (failedAt.get(y) ?? -Infinity))[0] ?? null;
  }
  async function rootSlice(root, deadline) {
    const r = await sharedFetchRoot(root, deadline);
    if (r.error !== null) {
      failedAt.set(root, clock2.now());
      return r;
    }
    failedAt.delete(root);
    const at = clock2.now();
    trees.set(root, { sections: r.sections, at });
    const news = !current || !(root in current.roots) || stale(current.roots[root]);
    const roots = { ...current ? current.roots : {}, ...news ? { [root]: at } : {} };
    if (KINDS.every(({ root: k }) => trees.has(k) && !stale(trees.get(k).at))) {
      const rows2 = classify(Object.fromEntries(KINDS.map(({ root: k }) => [k, trees.get(k).sections])));
      const everyRoot = KINDS.map(({ root: k }) => k);
      current = { rows: rows2, roots: Object.fromEntries(everyRoot.map((k) => [k, trees.get(k).at])), whole: new Set(everyRoot), withAll: new Set(everyRoot) };
    } else {
      const rows2 = mergeRoot(current ? current.rows : [], root, classify({ [root]: r.sections }));
      current = { rows: rows2, roots, whole: /* @__PURE__ */ new Set([...current ? current.whole : [], root]), withAll: /* @__PURE__ */ new Set([...current ? current.withAll : [], root]) };
    }
    if (news) dirty = true;
    return r;
  }
  let served = null;
  const servedNow = () => {
    const cur = getCurrent();
    if (!cur) return "none";
    if (KINDS.some(({ root }) => !(root in cur.roots))) return "partial";
    return KINDS.some(({ root }) => stale(cur.roots[root])) ? "cache" : "fresh";
  };
  async function buildRows(need = "full", budgetMs = CALL_BUDGET_MS.home, root = null) {
    const startedAt = clock2.now();
    getCurrent();
    const warm = current !== null;
    const phaseEnd = Math.min(startedAt + (warm ? WARM_REFRESH_MS : COLD_DEADLINE_MS), startedAt + budgetMs - SLICE_MARGIN_MS);
    const storedBefore = warm ? Object.keys(current.roots).length : 0;
    const failed = [];
    let got = 0;
    let ensuring = null;
    let ensureError = null;
    const asked = /* @__PURE__ */ new Set();
    const held = warm && refreshHeld();
    let refreshed = false;
    async function lane() {
      let next;
      while (ensureError === null && clock2.now() - startedAt < SLICE_START_MS && (next = nextRoot(need, root, asked, !held)) !== null) {
        asked.add(next);
        try {
          await (ensuring ?? (ensuring = session.ensure({ deadline: phaseEnd })));
        } catch (e) {
          ensureError = e;
          break;
        }
        if (current === null && failed.length === 0 && got === 0) trace(kino2, "home", "refresh", { why: "cold" });
        const refresh = warm && current !== null && next in current.roots;
        if (refresh && !refreshed) {
          refreshed = true;
          stamp(REFRESH_AT_KEY, SLOW_REFRESH_GAP_MS);
        }
        const r = await rootSlice(next, phaseEnd);
        if (r.error !== null) failed.push(r);
        else got++;
        if (refresh && clock2.now() - startedAt >= HEAVY_REFRESH_MS) markHeavy();
      }
    }
    await Promise.all(Array.from({ length: !warm && portalSlow() ? COLD_PARALLEL : 1 }, lane));
    if (ensureError !== null && !current) throw slowPortal(kino2, ensureError);
    if (dirty) save();
    if (refreshed) noteRefresh(clock2.now() - startedAt);
    const storedAfter = current ? Object.keys(current.roots).length : 0;
    if (storedAfter > storedBefore && storedBefore < KINDS.length) {
      report(
        kino2,
        PERF_AREAS.cold,
        storedAfter === KINDS.length ? "done" : "progress",
        { stored: storedAfter, of: KINDS.length, b: msBucket(clock2.now() - startedAt) }
      );
    }
    const how = servedNow();
    served = { served: how, got, fail: failed.length, ...held && how !== "fresh" ? { held: 1 } : {} };
    if (current) return current.rows;
    if (failed.length > 0) {
      summarizeFailure(failed, 1);
      throw slowPortal(kino2, worstOf(failed));
    }
    return [];
  }
  function rowMissing() {
    const cur = getCurrent();
    if (!cur || KINDS.some(({ root }) => !(root in cur.roots))) {
      throw kino2.error("unavailable", "Xuper todav\xEDa est\xE1 cargando su cat\xE1logo, intenta de nuevo en un momento");
    }
    throw kino2.error("not_found", "No se encontr\xF3 esa lista");
  }
  async function home2() {
    const live2 = countryRow ? countryRow(Math.min(clock2.now() + LIVE_ROW_MS, callDeadline(clock2, CALL_BUDGET_MS.home))).catch(() => null) : Promise.resolve(null);
    const rows2 = projectRows(await buildRows("home", CALL_BUDGET_MS.home), clock2.now(), ids.lookup(), isEnglish(kino2), isSpanish(kino2));
    const row2 = await live2;
    return row2 ? [...rows2.slice(0, MAX_HOME_ROWS - 1), row2] : rows2;
  }
  let adultInflight = null;
  let adultIds = /* @__PURE__ */ new Set();
  async function fetchAdult(deadline) {
    await session.ensure({ deadline });
    const response = await session.withValidSession((v) => portal.call(
      "getNextColumns",
      { columnCode: ADULT_ROOT_CODE, pageNum: 1, pageSize: TREE_PAGE_SIZE, version: "" },
      viewOpts(v)
    ), { seedFallback: true, deadline });
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    const listed = /* @__PURE__ */ new Set();
    for (const s of parseTree(response)) {
      for (const item of s.items) {
        listed.add(item.id);
        if (isSeries(item.type) || seen.has(item.id)) continue;
        seen.add(item.id);
        out.push(item);
      }
    }
    if (listed.size > 0) adultIds = listed;
    return out;
  }
  function adultMovies(deadline) {
    if (!adultInflight) adultInflight = fetchAdult(deadline).finally(() => {
      adultInflight = null;
    });
    return adultInflight;
  }
  const adultWithin = async (budgetMs) => {
    try {
      return await adultMovies(Math.min(clock2.now() + COLD_DEADLINE_MS, callDeadline(clock2, budgetMs)));
    } catch (e) {
      throw slowPortal(kino2, e);
    }
  };
  async function browseAdult(cursor) {
    const all = oneEach(await adultWithin(CALL_BUDGET_MS.browse));
    const offset = offsetOf(cursor);
    const nowMs = clock2.now();
    const idsOf = ids.lookup();
    const items = all.slice(offset, offset + BROWSE_PAGE).map((i) => projectItem(i, nowMs, idsOf, isEnglish(kino2), isSpanish(kino2))).filter((i) => i !== null).map((i) => ({ ...i, adult: true }));
    const next = offset + BROWSE_PAGE;
    return next < all.length ? { items, next: String(next) } : { items };
  }
  async function browse2(ref, cursor) {
    if (ref === ADULT_REF) return browseAdult(cursor);
    const row2 = typeof ref === "string" ? (await buildRows("full", CALL_BUDGET_MS.browse, rootOfRow(ref))).find((r) => r.id === ref) : void 0;
    if (!row2) rowMissing();
    const offset = offsetOf(cursor);
    const nowMs = clock2.now();
    const list = oneEach(row2.all ?? (offset === 0 ? row2.shown : []));
    const idsOf = ids.lookup();
    const items = list.slice(offset, offset + BROWSE_PAGE).map((i) => projectItem(i, nowMs, idsOf, isEnglish(kino2), isSpanish(kino2))).filter((i) => i !== null);
    const next = offset + BROWSE_PAGE;
    return row2.all && next < list.length ? { items, next: String(next) } : { items };
  }
  const { search: globalSearch } = makeSearch({ kino: kino2, portal, session, clock: clock2, tmdb, isAdultId: (id) => adultIds.has(id), idsLookup: ids.lookup });
  async function searchWithin(query) {
    const q = typeof query.q === "string" ? query.q.trim() : "";
    if (q === "") return { items: [] };
    const within = query.within;
    if (isLiveTileRef(within)) return null;
    const adult = within === ADULT_REF;
    let pool;
    if (adult) {
      pool = await adultWithin(CALL_BUDGET_MS.search);
    } else {
      const row2 = typeof within === "string" ? (await buildRows("full", CALL_BUDGET_MS.search, rootOfRow(within))).find((r) => r.id === within) : void 0;
      if (!row2) return null;
      pool = row2.all ?? row2.shown;
    }
    const ranked = oneEach(rankWithin(kino2, pool, q));
    const offset = offsetOf(query.cursor);
    const nowMs = clock2.now();
    const idsOf = ids.lookup();
    const items = ranked.slice(offset, offset + BROWSE_PAGE).map((i) => projectItem(i, nowMs, idsOf, isEnglish(kino2), isSpanish(kino2))).filter((i) => i !== null).map((i) => adult ? { ...i, adult: true } : i);
    const next = offset + BROWSE_PAGE;
    return next < ranked.length ? { items, next: String(next) } : { items };
  }
  async function search2(query) {
    if (query !== null && typeof query === "object" && query.within !== void 0 && query.within !== null) return searchWithin(query);
    return globalSearch(query);
  }
  const portalChapters = makePortalChapters({ kino: kino2, portal, session, clock: clock2, onServed: (how) => {
    served = { served: how };
  }, ids });
  const episodes2 = makeEpisodes({ kino: kino2, tmdb, portalChapters, clock: clock2, ids });
  const rows = (need = "full", root = null) => buildRows(need, CALL_BUDGET_MS[need] ?? CALL_BUDGET_MS.home, root);
  const servedBy2 = () => {
    const out = served ?? {};
    served = null;
    return out;
  };
  const idsLookup = () => ids.lookup();
  return { home: home2, browse: browse2, rows, search: search2, episodes: episodes2, portalChapters, servedBy: servedBy2, idsLookup };
}

// src/tmdb.js
var TMDB_BASE = "https://api.themoviedb.org/3";
var TMDB_LANGUAGE = "es-MX";
var TIMEOUT_MS = 8e3;
var MIN_TIMEOUT_MS = 500;
var IMG = "https://image.tmdb.org/t/p";
var IMDB_ID = /^tt\d{7,}$/;
var text = (v) => typeof v === "string" ? v : "";
var blank3 = (s) => s.trim() === "";
var AIR_DATE = /^\d{4}-\d{2}-\d{2}$/;
var MIN_RUNTIME = 1;
var MAX_RUNTIME = 1e3;
function bodyOf(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (_) {
      return null;
    }
  }
  return body !== null && typeof body === "object" ? body : null;
}
function parseTitleForms(type, body) {
  const o = bodyOf(body);
  if (o === null || typeof o !== "object" || Array.isArray(o)) return null;
  const isTv = type === "tv";
  const localized = text(isTv ? o.name : o.title);
  const original = text(isTv ? o.original_name : o.original_title);
  const list = o.translations && Array.isArray(o.translations.translations) ? o.translations.translations : [];
  const entries = list.filter((t) => t !== null && typeof t === "object");
  const titleOf = (t) => t.data !== null && typeof t.data === "object" ? text(isTv ? t.data.name : t.data.title) : "";
  const englishEntry = entries.find((t) => t.iso_639_1 === "en");
  const spanish = [];
  const seen = /* @__PURE__ */ new Set();
  for (const t of entries) {
    if (t.iso_639_1 !== "es") continue;
    const title2 = titleOf(t);
    const key = title2.trim().toLowerCase();
    if (blank3(title2) || key === localized.toLowerCase() || seen.has(key)) continue;
    seen.add(key);
    spanish.push(title2);
  }
  return {
    title: localized,
    originalTitle: original,
    englishTitle: englishEntry ? titleOf(englishEntry) : "",
    spanishTitles: spanish
  };
}
var INT6 = /^[+-]?\d+$/;
function optInt2(v) {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string" && INT6.test(v.trim())) return Number(v.trim());
  return 0;
}
var imageUrl = (path, size) => typeof path !== "string" || blank3(path) || path === "null" ? "" : `${IMG}/${size}${path}`;
function parseSeriesByImdb(body) {
  const o = bodyOf(body);
  const tv = isObject(o) && Array.isArray(o.tv_results) && isObject(o.tv_results[0]) ? o.tv_results[0] : null;
  if (tv === null) return null;
  const tmdbId = optInt2(tv.id);
  if (tmdbId <= 0) return null;
  return { tmdbId, title: text(tv.name), poster: imageUrl(tv.poster_path, "w500"), backdrop: imageUrl(tv.backdrop_path, "w1280") };
}
var plainWords2 = (t) => String(t).toLowerCase().normalize("NFD").replace(/\p{Mn}+/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
function pickSeriesByTitle(body, title2) {
  const o = bodyOf(body);
  const want = plainWords2(title2);
  if (!isObject(o) || !Array.isArray(o.results) || want === "") return null;
  const hits = o.results.filter((r) => isObject(r) && optInt2(r.id) > 0).slice(0, 10);
  const forms = (r) => [plainWords2(text(r.name)), plainWords2(text(r.original_name))];
  const pick = (r) => ({ tmdbId: optInt2(r.id), title: text(r.name), poster: imageUrl(r.poster_path, "w500"), backdrop: imageUrl(r.backdrop_path, "w1280") });
  const exact = hits.filter((r) => forms(r).includes(want));
  if (exact.length === 1) return pick(exact[0]);
  if (exact.length > 1) return null;
  const words = want.split(" ");
  const holding = hits.filter((r) => forms(r).some((f) => {
    const fw = f.split(" ");
    return words.every((w) => fw.includes(w));
  }));
  if (holding.length === 1) return pick(holding[0]);
  if (holding.length > 1) {
    const ranked = holding.slice().sort((a, b) => (Number(b.popularity) || 0) - (Number(a.popularity) || 0));
    if ((Number(ranked[0].popularity) || 0) >= 2 * (Number(ranked[1].popularity) || 0) && (Number(ranked[0].popularity) || 0) > 0) return pick(ranked[0]);
  }
  return null;
}
function parseSeasonEpisodes(body) {
  const o = bodyOf(body);
  if (!isObject(o)) return null;
  const list = Array.isArray(o.episodes) ? o.episodes : [];
  return list.filter(isObject).map((e) => {
    const episode = optInt2(e.episode_number);
    const name = text(e.name);
    const airDate = text(e.air_date).trim();
    const runtime = optInt2(e.runtime);
    return {
      episode,
      name: blank3(name) ? `Episodio ${episode}` : name,
      overview: text(e.overview),
      still: imageUrl(e.still_path, "w300"),
      airDate: AIR_DATE.test(airDate) ? airDate : "",
      runtimeMinutes: runtime >= MIN_RUNTIME && runtime <= MAX_RUNTIME ? runtime : 0
    };
  });
}
function makeTmdb({ kino: kino2, clock: clock2 = null }) {
  function timeoutFor(bounds) {
    const deadline = bounds && typeof bounds.deadline === "number" && clock2 ? bounds.deadline : null;
    if (deadline === null) return TIMEOUT_MS;
    const ms = Math.min(TIMEOUT_MS, Math.floor(deadline - clock2.now()));
    return ms >= MIN_TIMEOUT_MS ? ms : null;
  }
  function keyMarker() {
    try {
      return kino2.secret("tmdbKey");
    } catch (_) {
      return null;
    }
  }
  async function titleForms(type, id, bounds) {
    try {
      if (!Number.isInteger(id) || id <= 0) return null;
      const kind = type === "movie" ? "movie" : "tv";
      const body = await read(`/${kind}/${id}`, { language: TMDB_LANGUAGE, append_to_response: "translations" }, bounds);
      return body === null ? null : parseTitleForms(kind, body);
    } catch (_) {
      return null;
    }
  }
  async function read(path, params, bounds) {
    try {
      if (timeoutFor(bounds) === null) return null;
      if (typeof kino2.tmdb === "function") {
        try {
          const body = await kino2.tmdb(path, { ...params });
          if (body !== null && typeof body === "object") return body;
        } catch (_) {
        }
      }
      const timeoutMs = timeoutFor(bounds);
      if (timeoutMs === null) return null;
      const key = keyMarker();
      if (!key) return null;
      const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
      const res = await kino2.fetch(`${TMDB_BASE}${path}?api_key=${key}&${query}`, { cookies: false, timeoutMs });
      if (!res || !res.ok) return null;
      return res.text();
    } catch (_) {
      return null;
    }
  }
  async function seriesByImdb(imdbId, bounds) {
    if (typeof imdbId !== "string" || !IMDB_ID.test(imdbId)) return null;
    const body = await read(`/find/${imdbId}`, { external_source: "imdb_id", language: TMDB_LANGUAGE }, bounds);
    return body === null ? null : parseSeriesByImdb(body);
  }
  async function seriesByTitle(title2, bounds) {
    if (typeof title2 !== "string" || title2.trim() === "") return null;
    const body = await read("/search/tv", { query: title2.trim(), language: TMDB_LANGUAGE }, bounds);
    return body === null ? null : pickSeriesByTitle(body, title2);
  }
  async function seasonEpisodes(tvId, season, language = TMDB_LANGUAGE, bounds) {
    if (!Number.isInteger(tvId) || tvId <= 0 || !Number.isInteger(season)) return null;
    const body = await read(`/tv/${tvId}/season/${season}`, { language }, bounds);
    return body === null ? null : parseSeasonEpisodes(body);
  }
  return { titleForms, seriesByImdb, seriesByTitle, seasonEpisodes };
}

// src/resolve.js
var SLB_DEFAULT_TTL_S = 300;
var FOLLOW_UP_RESERVE_MS = 3e3;
var AUTH_MARGIN_S = 300;
var EXPIRED = /expired=(\d+)/;
var MAX_SUBTITLES = 30;
var MAX_ALTERNATIVES = 8;
var RETRY_COPIES = 3;
var RETRY_COPIES_SELF_RETRYING = 1;
var SELF_RETRYING_KINO = [0, 9, 54];
var APP_VERSION = /^(\d+)\.(\d+)\.(\d+)/;
var MAX_LABEL_CHARS = 48;
var EXPIRES_MIN_S = 30;
var EXPIRES_MAX_S = 86400;
var INT7 = /^[+-]?\d+$/;
function retryCopiesFor(kino2) {
  let version = "";
  try {
    version = kino2 && typeof kino2.appVersion === "string" ? kino2.appVersion.trim() : "";
  } catch (_) {
    return RETRY_COPIES;
  }
  const m = APP_VERSION.exec(version);
  if (!m) return RETRY_COPIES;
  const parts = m.slice(1, 4).map(Number);
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] !== SELF_RETRYING_KINO[i]) return parts[i] > SELF_RETRYING_KINO[i] ? RETRY_COPIES_SELF_RETRYING : RETRY_COPIES;
  }
  return RETRY_COPIES_SELF_RETRYING;
}
var DIGITS = /^[0-9]+$/;
function isCfl(url) {
  return url.slice(url.lastIndexOf("?") + 1).split("&").some((p) => p.trim() === "sign_type=cfl");
}
function withScheme(mainAddr) {
  const clean = mainAddr.replace(/\/+$/, "");
  return clean.startsWith("http://") || clean.startsWith("https://") ? clean : `https://${clean}`;
}
function portalDurationMs(raw) {
  if (typeof raw === "number") return Number.isFinite(raw) && raw > 0 ? Math.trunc(raw * 1e3) : 0;
  if (typeof raw !== "string") return 0;
  const text2 = raw.trim();
  if (text2 === "") return 0;
  const parts = text2.split(":");
  if (parts.length > 3 || parts.some((p) => !DIGITS.test(p))) return 0;
  return parts.reduce((acc, p) => acc * 60 + Number(p), 0) * 1e3;
}
var mediaScore = (m) => (optStringStrict(m.encodeFormat).toLowerCase() === "h264" ? 0 : 2) + (optStringStrict(m.videoFormat).toLowerCase() === "mp4" ? 0 : 1);
function rankedMedia(play) {
  const episode = isObject(play) ? objects(play.episodeList)[0] : void 0;
  if (!episode) return [];
  const candidates = objects(episode.totalMovieList).flatMap((tm) => objects(tm.movieList)).filter((m) => notBlank(optStringStrict(m.contentId)));
  return candidates.map((m, i) => ({ m, i, s: mediaScore(m) })).sort((a, b) => a.s - b.s || a.i - b.i).map((x) => x.m);
}
var CODEC_NAMES = { h264: "H.264", avc: "H.264", h265: "H.265", hevc: "H.265", av1: "AV1", vp9: "VP9" };
var codecName = (m) => {
  const raw = optStringStrict(m.encodeFormat).trim();
  return CODEC_NAMES[raw.toLowerCase()] ?? raw.toUpperCase();
};
var labelOf = (text2) => text2.length <= MAX_LABEL_CHARS ? text2 : text2.slice(0, MAX_LABEL_CHARS).trimEnd();
function expiresInSeconds(auth, nowMs) {
  const m = EXPIRED.exec(typeof auth === "string" ? auth : "");
  if (!m) return null;
  const left = Number(m[1]) - Math.floor(nowMs / 1e3) - AUTH_MARGIN_S;
  if (!Number.isFinite(left)) return null;
  return Math.min(EXPIRES_MAX_S, Math.max(EXPIRES_MIN_S, left));
}
var licenseOf = (m) => optStringStrict(objects(m.licenseList)[0]?.license);
function readSubtitles(play) {
  const episode = objects(play.episodeList)[0];
  const out = [];
  for (const sub of objects(episode?.subtitleList)) {
    const file = objects(sub.file)[0];
    if (!file) continue;
    const url = optStringStrict(file.url);
    if (!notBlank(url)) continue;
    out.push({ lang: optStringStrict(sub.language), url, format: notBlank(optStringStrict(file.fileType)) ? optStringStrict(file.fileType) : "srt" });
  }
  return out.slice(0, MAX_SUBTITLES);
}
function vodCdns(slb) {
  const out = [];
  for (const cdn of objects(slb.cdn_list)) {
    if (optStringStrict(cdn.tag) !== "vod") continue;
    for (const u of objects(cdn.url_list)) {
      const url = optStringStrict(u.url);
      if ((isCfl(url) || optStringStrict(u.sign_type) === "cfl") && optStringStrict(u.tag) === "free") {
        const bases = [withScheme(optStringStrict(cdn.main_addr))];
        const spare = optStringStrict(cdn.spared_addr);
        if (notBlank(spare) && !bases.includes(withScheme(spare.trim()))) bases.push(withScheme(spare.trim()));
        out.push({ bases, auth: url });
        break;
      }
    }
  }
  return out;
}
function vodCdn(slb) {
  const first = vodCdns(slb)[0];
  return first ? { base: first.bases[0], auth: first.auth } : null;
}
function slbLifetime(slb, nowMs) {
  const text2 = optStringStrict(slb.invalidTime);
  const declaredN = INT7.test(text2) ? Number(text2) : NaN;
  const declared = declaredN > 0 ? declaredN : SLB_DEFAULT_TTL_S;
  const cdn = vodCdn(slb);
  if (!cdn) return 0;
  const m = EXPIRED.exec(cdn.auth);
  if (!m) return declared;
  return Math.min(declared, Number(m[1]) - Math.floor(nowMs / 1e3) - AUTH_MARGIN_S);
}
var slbBean = (apkVersion, liveCodes = ["masnew_live"]) => ({
  hasPay: "0",
  userIdentity: "1",
  type: "merge",
  appVer: apkVersion,
  lang: "es",
  encMediaSupported: 1,
  liveCodeList: [...liveCodes],
  appParams: "",
  reserve1: FIXED_MAC,
  pipFlag: "0"
});
function makeResolve({ kino: kino2, portal, session, clock: clock2, config, portalChapters, live: live2 = null }) {
  const unavailable = (text2) => kino2.error("unavailable", text2);
  let slbCache = null;
  const slbFor = async (v) => {
    if (slbCache && slbCache.token === v.userToken && clock2.now() < slbCache.expiresMs) return slbCache.slb;
    const answer = await portal.call("v14/getSlbInfo", slbBean(config.apkVersion), viewOpts(v));
    const fresh = isObject(answer) ? answer : {};
    const ttl = slbLifetime(fresh, clock2.now());
    slbCache = ttl > 0 ? { slb: fresh, token: v.userToken, expiresMs: clock2.now() + ttl * 1e3 } : null;
    return fresh;
  };
  const sessionSlb = (seed, deadline) => seed ? slbFor({ ...seed, deadline }) : session.withValidSession(slbFor, { deadline });
  async function chapterFrom(magis, deadline) {
    const { items } = await portalChapters(magis.contentId, deadline);
    if (items.length === 0) throw unavailable(`la serie ${magis.contentId} vino sin cap\xEDtulos`);
    const chapter2 = findChapter(items, magis.episode);
    if (!chapter2) throw unavailable(`la serie no tiene el cap\xEDtulo ${magis.episode}`);
    return chapter2;
  }
  async function resolveVod(magis, chapter2, deadline) {
    await session.ensure({ deadline: deadline - FOLLOW_UP_RESERVE_MS });
    const contentId = chapter2 && notBlank(chapter2.contentId) ? chapter2.contentId : magis.contentId;
    let played = null;
    const play = await session.withValidSession((v) => {
      played = v;
      return portal.call(
        "v10/startPlayVOD",
        { contentId, seriesContentId: chapter2 ? magis.contentId : "", startTime: 0, type: "1", columnId: 0, authType: "" },
        viewOpts(v)
      );
    }, { seedFallback: true, deadline: deadline - FOLLOW_UP_RESERVE_MS });
    const tracks = rankedMedia(play);
    const best = tracks[0];
    if (!best) throw unavailable("Xuper devolvi\xF3 sin media reproducible");
    const license = licenseOf(best);
    if (!notBlank(license)) throw unavailable("Xuper devolvi\xF3 sin licenseList");
    const cdns = vodCdns(await sessionSlb(played && played.sn ? played : null, deadline));
    if (cdns.length === 0) throw unavailable("Xuper no expuso CDN de vod con token libre");
    const copies = [];
    const seen = /* @__PURE__ */ new Set();
    const seenTracks = /* @__PURE__ */ new Set();
    const prefixes = /* @__PURE__ */ new Set();
    for (const track of tracks) {
      const id = optStringStrict(track.contentId);
      const trackLicense = track === best ? license : licenseOf(track);
      if (track !== best && (!notBlank(id) || !notBlank(trackLicense) || seenTracks.has(id))) continue;
      seenTracks.add(id);
      let prefix = "";
      if (track !== best) {
        const codec = codecName(track);
        prefix = codec !== "" ? codec : say(kino2, "versionN", { n: seenTracks.size });
        if (prefixes.has(prefix)) prefix = `${prefix} (${seenTracks.size})`;
        prefixes.add(prefix);
      }
      const ext = optStringStrict(track.videoFormat).toLowerCase() === "ts" ? "ts" : "mp4";
      for (const [ci, cdn] of cdns.entries()) {
        for (const [bi, base] of cdn.bases.entries()) {
          const url = `${base}/vod/${id}_media.${ext}`;
          if (seen.has(url)) continue;
          seen.add(url);
          const server = `${say(kino2, "server", { n: ci + 1 })}${bi > 0 ? ` \xB7 ${say(kino2, "backup")}` : ""}`;
          copies.push({
            url,
            label: labelOf(prefix !== "" ? `${prefix} \xB7 ${server}` : server),
            mime: ext === "mp4" ? "video/mp4" : "video/mp2t",
            headers: {
              "Content-Auth": cdn.auth,
              // the querystring verbatim: VOD is not re-signed
              "Content-License": trackLicense,
              "User-Agent": UA_CDN,
              App: config.appId,
              "App-Version": config.apkVersion
            }
          });
        }
      }
    }
    const bestCopy = copies[0];
    const retryCopies = retryCopiesFor(kino2);
    for (let n = 1; bestCopy && n <= retryCopies && copies.length <= MAX_ALTERNATIVES; n++) {
      copies.push({
        ...bestCopy,
        url: `${bestCopy.url}${bestCopy.url.includes("?") ? "&" : "?"}retry=${n}`,
        label: labelOf(`${bestCopy.label} \xB7 ${say(kino2, "retry", { n })}`)
      });
    }
    const [first, ...others] = copies;
    const alternatives = others.slice(0, MAX_ALTERNATIVES);
    if (alternatives.length > 0) trace(kino2, "resolve", "alts", { n: alternatives.length, tracks: seenTracks.size, cdns: cdns.length });
    const expires = expiresInSeconds(first.headers["Content-Auth"], clock2.now());
    return {
      ...first,
      subtitles: readSubtitles(play),
      // A chapter's own declared duration wins (the portal sends it empty for most series).
      durationMs: chapter2 ? portalDurationMs(chapter2.duration) : portalDurationMs(best.duration),
      ...expires !== null ? { expiresInSeconds: expires } : {},
      ...alternatives.length > 0 ? { alternatives } : {}
    };
  }
  async function resolve2(ref, options) {
    if (live2 && isChannelRef(ref)) return live2.resolveLive(codeOfRef(ref), options);
    const deadline = callDeadline(clock2, CALL_BUDGET_MS.resolve);
    try {
      const magis = decode(ref);
      if (!magis) throw unavailable("ese ref no es de Xuper: no se puede reproducir");
      const chapter2 = magis.isSeries ? await chapterFrom(magis, deadline - 2 * FOLLOW_UP_RESERVE_MS) : null;
      return await resolveVod(magis, chapter2, deadline);
    } catch (e) {
      if (e instanceof PortalError) throw mapPortalError(e.code, e.message, kino2);
      if (isKinoError(e)) throw e;
      throw unavailable("Xuper no est\xE1 disponible ahora");
    }
  }
  return { resolve: resolve2 };
}

// src/countryRow.js
var CATEGORIES_BY_COUNTRY = Object.freeze({
  CO: "Colombia",
  VE: "Venezuela",
  EC: "Ecuador",
  CL: "Chile",
  MX: "M\xE9xico",
  PE: "Per\xFA",
  BO: "Bolivia",
  UY: "Uruguay",
  PY: "Paraguay",
  PA: "Panam\xE1",
  PR: "Puerto Rico",
  ES: "Espa\xF1a",
  CR: "Costa Rica",
  US: "Estados Unidos",
  HN: "Honduras",
  SV: "El Salvador",
  DO: "Rep\xFAblica Dominicana",
  GT: "Centroam\xE9rica",
  NI: "Centroam\xE9rica",
  BZ: "Centroam\xE9rica"
});
var COUNTRY_OPTIONS = Object.freeze([
  { value: "none", label: "Ninguno" },
  { value: "BO", label: "Bolivia" },
  { value: "CL", label: "Chile" },
  { value: "CO", label: "Colombia" },
  { value: "CR", label: "Costa Rica" },
  { value: "EC", label: "Ecuador" },
  { value: "SV", label: "El Salvador" },
  { value: "ES", label: "Espa\xF1a" },
  { value: "US", label: "Estados Unidos" },
  { value: "GT-NI-BZ", label: "Guatemala, Nicaragua o Belice" },
  { value: "HN", label: "Honduras" },
  { value: "MX", label: "M\xE9xico" },
  { value: "PA", label: "Panam\xE1" },
  { value: "PY", label: "Paraguay" },
  { value: "PE", label: "Per\xFA" },
  { value: "PR", label: "Puerto Rico" },
  { value: "DO", label: "Rep\xFAblica Dominicana" },
  { value: "UY", label: "Uruguay" },
  { value: "VE", label: "Venezuela" }
]);
var OPTION_GROUPS = Object.freeze({ "GT-NI-BZ": Object.freeze(["GT", "NI", "BZ"]) });
function countriesOf(value) {
  if (typeof value !== "string") return [];
  if (Object.hasOwn(OPTION_GROUPS, value)) return [...OPTION_GROUPS[value]];
  return Object.hasOwn(CATEGORIES_BY_COUNTRY, value) ? [value] : [];
}
var HOME_COUNTRY_SETTING = "homeCountry";
var COUNTRY_ROW_ID = "live-country";
var COUNTRY_ROW_LIMIT = 20;
function makeCountryRow({ kino: kino2, live: live2 }) {
  return async function countryRow(deadline) {
    try {
      const names = [...new Set(countriesOf(kino2.config.get(HOME_COUNTRY_SETTING)).map((cc) => CATEGORIES_BY_COUNTRY[cc]))];
      if (names.length === 0) return null;
      const all = await live2.categoriesWithin(deadline);
      const categories2 = names.map((n) => all.find((c) => c.name === n)).filter(Boolean);
      const channels = [];
      const seen = /* @__PURE__ */ new Set();
      for (const category of categories2) {
        if (channels.length >= COUNTRY_ROW_LIMIT) break;
        for (const c of await live2.channelsWithin(category.id, deadline)) if (!seen.has(c.id) && seen.add(c.id)) channels.push(c);
      }
      const items = channels.slice(0, COUNTRY_ROW_LIMIT).map((c) => {
        const item = { kind: "live", id: c.id, title: c.title, ref: c.ref };
        if (c.logo) item.poster = c.logo;
        if (c.adult === true) item.adult = true;
        return item;
      });
      return items.length > 0 ? { id: COUNTRY_ROW_ID, title: say(kino2, "liveChannelsRow"), items } : null;
    } catch (e) {
      trace(kino2, "home", "live_row_fail", { code: errCode(e) });
      return null;
    }
  };
}

// src/liveCatalog.js
var LIVE_ROOT = "masnew_live";
var CATEGORIES_PAGE_SIZE = 200;
var LIST_PAGE_SIZE = 250;
var LIST_MAX_PAGES = 20;
var SWEEP_PAGE_SIZE = 100;
var MAX_PAGES2 = 60;
var MAX_CATEGORIES = 200;
var ID2 = /^[A-Za-z0-9._~-]{1,128}$/;
var POSITIVE = /^\d{1,9}$/;
var SEARCH_INDEX_TTL_MS = 60 * 6e4;
var PARTIAL_INDEX_TTL_MS = 3 * 6e4;
var SEARCH_INDEX_KEY = "liveSearchIndex:v1";
var MAX_SEARCH_HITS = 100;
var MIN_SEARCH_CHARS = 2;
var CATEGORIES_KEY = "liveCats:v2";
var OLD_CATEGORIES_KEYS = ["liveCats:v1"];
var CATEGORIES_TTL_MS = 12 * 36e5;
var LOGOS_KEY = "liveLogos:v1";
var LOGOS_TTL_MS = 7 * 24 * 36e5;
var MAX_LOGO_CHARS = 512;
var plain2 = (text2) => String(text2).toLowerCase().normalize("NFD").replace(/\p{Mn}+/gu, "").replace(/\s+/g, " ").trim();
var ALL_CHANNELS = "ChannelList";
var NAMES = { [ALL_CHANNELS]: "Todos" };
var ADULT_NAMES = /* @__PURE__ */ new Set(["18+", "adultos", "adulto", "xxx", "+18"]);
var GENRE_BY_NAME = new Map(Object.entries({
  deportes: "deportes",
  deporte: "deportes",
  sports: "deportes",
  futbol: "deportes",
  noticias: "noticias",
  news: "noticias",
  infantil: "infantil",
  infantiles: "infantil",
  kids: "infantil",
  ninos: "infantil",
  musica: "musica",
  music: "musica",
  documentales: "documentales",
  documental: "documentales",
  peliculas: "peliculas",
  series: "series",
  anime: "anime",
  entretenimiento: "entretenimiento"
}));
var genreOfCategory = (name) => GENRE_BY_NAME.get(plain2(name)) ?? null;
var TILE_GENRE_BY_NAME = new Map(Object.entries({ "cine y series": "cineyseries" }));
var tileGenreOfCategory = (name) => genreOfCategory(name) ?? TILE_GENRE_BY_NAME.get(plain2(name)) ?? null;
var COUNTRY_BY_NAME = (() => {
  const codes = /* @__PURE__ */ new Map();
  for (const [cc, name] of Object.entries(CATEGORIES_BY_COUNTRY)) codes.set(plain2(name), codes.has(plain2(name)) ? null : cc);
  return codes;
})();
var countryOfCategory = (name) => COUNTRY_BY_NAME.get(plain2(name)) ?? null;
function makeLiveCatalog({ kino: kino2, portal, session, clock: clock2 }) {
  let adultIds = null;
  let genreById = null;
  const surface = (e) => {
    if (e instanceof PortalError) return mapPortalError(e.code, e.message, kino2);
    if (isKinoError(e)) return e;
    return kino2.error("unavailable", "Xuper no est\xE1 disponible ahora");
  };
  async function readCategories(deadline) {
    let response;
    try {
      await session.ensure({ deadline });
      response = await session.withValidSession(({ userId, userToken }) => portal.call(
        "getNextColumns",
        { columnCode: LIVE_ROOT, pageNum: 1, pageSize: CATEGORIES_PAGE_SIZE, version: "" },
        { baseFields: true, userId, userToken, deadline }
      ), { deadline });
    } catch (e) {
      throw surface(e);
    }
    const columns = isObject(response) && Array.isArray(response.recommendList) ? response.recommendList : [];
    const out = [];
    for (const c of columns) {
      if (!isObject(c)) continue;
      const id = intOrNull(c.columnId);
      if (id === null || id <= 0) continue;
      const raw = asText(c.name);
      const name = Object.hasOwn(NAMES, raw) ? NAMES[raw] : raw;
      if (isBlank(name)) continue;
      out.push({ id: String(id), name, adult: ADULT_NAMES.has(name.trim().toLowerCase()), ...raw === ALL_CHANNELS ? { all: true } : {} });
    }
    if (out.length > 0) {
      adultIds = new Set(out.filter((c) => c.adult).map((c) => c.id));
      genreById = new Map(genreCategoriesOf(out).map((c) => [c.id, c.genre]));
      store(out);
    }
    return out;
  }
  const genreCategoriesOf = (list) => list.filter((c) => !c.adult && !c.all && POSITIVE.test(c.id) && Number(c.id) > 0).map((c) => ({ id: c.id, genre: tileGenreOfCategory(c.name) })).filter((c) => c.genre !== null);
  function store(list) {
    try {
      const rows = genreCategoriesOf(list).slice(0, MAX_CATEGORIES).map((c) => [c.id, c.genre]);
      kino2.storage.set(CATEGORIES_KEY, JSON.stringify(rows), { ttlMs: CATEGORIES_TTL_MS });
      for (const k of OLD_CATEGORIES_KEYS) kino2.storage.remove(k);
    } catch (_) {
    }
  }
  let logos;
  function genreLogos() {
    if (logos !== void 0) return logos;
    logos = {};
    try {
      const text2 = kino2.storage.get(LOGOS_KEY);
      const map = typeof text2 === "string" ? JSON.parse(text2) : null;
      if (isObject(map)) {
        for (const [g, url] of Object.entries(map)) if (usableLogo(url)) logos[g] = url;
      }
    } catch (_) {
    }
    return logos;
  }
  const usableLogo = (url) => typeof url === "string" && url.length <= MAX_LOGO_CHARS && url.startsWith("https://");
  function genreOfId(categoryId) {
    if (genreById !== null) return genreById.get(categoryId) ?? null;
    return storedGenreCategories()?.find((c) => c.id === categoryId)?.genre ?? null;
  }
  function noteLogo(categoryId, items) {
    try {
      const genre = genreOfId(categoryId);
      if (genre === null) return;
      const known = genreLogos();
      if (Object.hasOwn(known, genre)) return;
      const logo = items.find((c) => usableLogo(c.logo))?.logo;
      if (!logo) return;
      logos = { ...known, [genre]: logo };
      kino2.storage.set(LOGOS_KEY, JSON.stringify(logos), { ttlMs: LOGOS_TTL_MS });
    } catch (_) {
    }
  }
  function storedGenreCategories() {
    try {
      const text2 = kino2.storage.get(CATEGORIES_KEY);
      if (typeof text2 !== "string") return null;
      const rows = JSON.parse(text2);
      if (!Array.isArray(rows)) return null;
      return rows.filter((r) => Array.isArray(r) && typeof r[0] === "string" && POSITIVE.test(r[0]) && typeof r[1] === "string").map((r) => ({ id: r[0], genre: r[1] }));
    } catch (_) {
      return null;
    }
  }
  async function liveCategories2() {
    const all = await readCategories(callDeadline(clock2, CALL_BUDGET_MS.liveCategories));
    return all.filter((c) => ID2.test(c.id)).slice(0, MAX_CATEGORIES).map((c) => {
      if (c.adult) return { id: c.id, title: c.name, adult: true };
      const out = { id: c.id, title: c.all ? say(kino2, "allChannels") : c.name };
      if (c.all) out.all = true;
      const country = countryOfCategory(c.name);
      if (country !== null) out.country = country;
      const genre = genreOfCategory(c.name);
      if (genre !== null) out.genre = genre;
      return out;
    });
  }
  async function isAdultCategory(id, deadline) {
    if (adultIds === null) {
      await readCategories(deadline);
      if (adultIds === null) throw kino2.error("unavailable", "Xuper no est\xE1 disponible ahora");
    }
    return adultIds.has(id);
  }
  async function fetchPage(columnId, page, deadline, pageSize = LIST_PAGE_SIZE) {
    await session.ensure({ deadline });
    const response = await session.withValidSession(({ userId, userToken }) => portal.call(
      "v6/getLiveData",
      { columnId: Number(columnId), pageNum: page, pageSize, dataVersion: "", expireTimeStr: "" },
      { baseFields: true, userId, userToken, deadline }
    ), { deadline });
    return isObject(response) && Array.isArray(response.channelList) ? response.channelList : [];
  }
  function project(list, categoryId, adult, drops = {}) {
    const seen = /* @__PURE__ */ new Set();
    const items = [];
    const drop = (why) => {
      drops[why] = (drops[why] ?? 0) + 1;
    };
    for (const c of list) {
      if (!isObject(c)) {
        drop("shape");
        continue;
      }
      const code = asText(c.channelCode);
      const title2 = asText(c.name);
      if (isBlank(code) || isBlank(title2)) {
        drop("blank");
        continue;
      }
      const channel = channelOf(code);
      if (!channel) {
        drop("badid");
        continue;
      }
      if (seen.has(channel.id)) {
        drop("dup");
        continue;
      }
      seen.add(channel.id);
      const n = intOrNull(c.channelNumber);
      const item = { id: channel.id, title: title2, ref: channel.ref, categoryId, number: n !== null && n >= 1 && n <= 9999 ? n : 0 };
      if (adult) item.adult = true;
      const logo = logoOf(c);
      if (logo) item.logo = logo;
      items.push(item);
    }
    return items;
  }
  async function liveChannels2({ categoryId, cursor } = {}) {
    const deadline = callDeadline(clock2, CALL_BUDGET_MS.liveChannels);
    if (typeof categoryId !== "string" || !POSITIVE.test(categoryId) || Number(categoryId) <= 0) {
      throw kino2.error("not_found", "No se encontr\xF3 esa categor\xEDa");
    }
    const id = String(Number(categoryId));
    const page = typeof cursor === "string" && POSITIVE.test(cursor) && Number(cursor) >= 1 ? Number(cursor) : 1;
    if (page > LIST_MAX_PAGES) return { items: [] };
    try {
      const adult = await isAdultCategory(id, deadline);
      const list = await fetchPage(id, page, deadline);
      const drops = {};
      const items = project(list, id, adult, drops);
      if (!adult) noteLogo(id, items);
      trace(kino2, "live", "page", { cat: id, page, raw: list.length, kept: items.length, ...drops });
      return list.length >= LIST_PAGE_SIZE && page < LIST_MAX_PAGES ? { items, next: String(page + 1) } : { items };
    } catch (e) {
      if (page > 1) {
        trace(kino2, "live", "page_fail", { cat: id, page, code: errCode(e) });
        return { items: [] };
      }
      throw surface(e);
    }
  }
  const categoriesWithin = (deadline) => readCategories(deadline);
  async function channelsWithin(id, deadline) {
    const adult = await isAdultCategory(id, deadline);
    return project(await fetchPage(id, 1, deadline), id, adult);
  }
  let index = null;
  let sweepState = null;
  let partialIndex = null;
  // Resumable sweep: a search call reads as many pages as its budget allows and keeps the
  // remaining sources/pages in module state, so the next call continues instead of freezing an
  // incomplete map as the final index.
  async function startSweep(deadline) {
    const all = (await readCategories(deadline)).filter((c) => ID2.test(c.id) && POSITIVE.test(c.id));
    if (all.length === 0) throw kino2.error("unavailable", "Xuper no est\xE1 disponible ahora");
    const everything = all.find((c) => c.all && !c.adult);
    const adultSources = all.filter((c) => c.adult);
    const plainSources = all.filter((c) => !c.adult);
    // The aggregate "everything" category is faster when healthy. Keep the real categories as a
    // fallback because a single broken aggregate must not leave the search with zero sources.
    const sources = everything ? [everything] : [...adultSources, ...plainSources];
    const fallbackSources = everything
      ? [...adultSources, ...plainSources.filter((c) => c.id !== everything.id)]
      : null;
    sweepState = {
      channels: /* @__PURE__ */ new Map(),
      sources,
      fallbackSources,
      sourceIndex: 0,
      page: 1,
      done: false,
      skipped: false,
      read: 0
    };
    return sweepState;
  }
  async function advanceSweep(deadline) {
    if (!sweepState || sweepState.done) await startSweep(deadline);
    const state = sweepState;
    while (state.sourceIndex < state.sources.length) {
      const source = state.sources[state.sourceIndex];
      let list;
      try {
        list = await fetchPage(source.id, state.page, deadline, SWEEP_PAGE_SIZE);
      } catch (e) {
        // Out of budget: keep the page pending so the next call resumes it.
        if (clock2.now() >= deadline) throw e;
        trace(kino2, "live", "search_source_failed", { source: source.id, code: errCode(e) });
        if (state.fallbackSources && state.fallbackSources.length > 0) {
          // The aggregate source failed before yielding anything: sweep the real categories.
          trace(kino2, "live", "search_source_fallback", { sources: state.fallbackSources.length });
          state.sources = state.fallbackSources;
          state.fallbackSources = null;
          state.sourceIndex = 0;
          state.page = 1;
          continue;
        }
        // A broken source must not hide the rest of the catalogue, but the index is not complete.
        state.skipped = true;
        state.sourceIndex++;
        state.page = 1;
        continue;
      }
      state.read++;
      for (const item of project(list, source.id, source.adult)) {
        if (!state.channels.has(item.id)) state.channels.set(item.id, { ...item, adult: source.adult });
      }
      if (list.length < SWEEP_PAGE_SIZE) {
        state.sourceIndex++;
        state.page = 1;
      } else if (state.page >= MAX_PAGES2) {
        // Provider still has pages but the local safety cap was reached: keep what was read and
        // move to the next source instead of treating the map as complete.
        trace(kino2, "live", "search_page_cap", { source: source.id, page: state.page });
        state.skipped = true;
        state.sourceIndex++;
        state.page = 1;
      } else {
        state.page++;
      }
    }
    state.done = true;
    return state;
  }
  function loadStoredIndex() {
    try {
      const text2 = kino2.storage.get(SEARCH_INDEX_KEY);
      if (typeof text2 !== "string") return null;
      const parsed = JSON.parse(text2);
      if (!isObject(parsed) || !Array.isArray(parsed.items) || typeof parsed.atMs !== "number") return null;
      if (clock2.now() - parsed.atMs >= SEARCH_INDEX_TTL_MS) return null;
      const channels = /* @__PURE__ */ new Map();
      for (const item of parsed.items) {
        if (isObject(item) && typeof item.id === "string" && typeof item.title === "string") {
          channels.set(item.id, item);
        }
      }
      return channels.size > 0 ? { atMs: parsed.atMs, channels } : null;
    } catch (_) {
      return null;
    }
  }
  function storeIndex(value) {
    try {
      kino2.storage.set(
        SEARCH_INDEX_KEY,
        JSON.stringify({ atMs: value.atMs, items: [...value.channels.values()] }),
        { ttlMs: SEARCH_INDEX_TTL_MS }
      );
    } catch (_) {
    }
  }
  async function channelIndex(deadline) {
    if (!index) index = loadStoredIndex();
    if (index && clock2.now() - index.atMs < SEARCH_INDEX_TTL_MS) {
      return { channels: index.channels, complete: true };
    }
    if (partialIndex && clock2.now() - partialIndex.atMs < PARTIAL_INDEX_TTL_MS) {
      return { channels: partialIndex.channels, complete: false };
    }
    try {
      const state = await advanceSweep(deadline);
      if (state.done && !state.skipped) {
        index = { atMs: clock2.now(), channels: state.channels };
        partialIndex = null;
        storeIndex(index);
        return { channels: state.channels, complete: true };
      }
      // Only throttle a genuinely finished-but-incomplete sweep. A sweep stopped by its budget
      // must resume on the next call instead of being cached for minutes.
      if (state.done) partialIndex = { atMs: clock2.now(), channels: state.channels };
      return { channels: state.channels, complete: false };
    } catch (e) {
      // Keep already-read hits. Only surface the failure when nothing could be read at all.
      if (sweepState && sweepState.read > 0) {
        trace(kino2, "live", "search_partial", { code: errCode(e), read: sweepState.read });
        partialIndex = { atMs: clock2.now(), channels: sweepState.channels };
        return { channels: sweepState.channels, complete: false };
      }
      sweepState = null;
      throw e;
    }
  }
  async function liveSearch2(arg) {
    const raw = isObject(arg) && typeof arg.query === "string" ? arg.query : "";
    const q = plain2(raw);
    if (q.length < MIN_SEARCH_CHARS) return { items: [], complete: false };
    const deadline = callDeadline(clock2, CALL_BUDGET_MS.liveSearch);
    const { channels, complete } = await channelIndex(deadline);
    const n = POSITIVE.test(q) ? Number(q) : null;
    const hits = [];
    for (const c of channels.values()) {
      const title2 = plain2(c.title);
      const rank = n !== null && c.number === n ? 0 : title2.startsWith(q) ? 1 : title2.includes(" " + q) ? 2 : title2.includes(q) ? 3 : -1;
      if (rank >= 0) hits.push({ c, rank, i: hits.length });
    }
    hits.sort((a, b) => a.rank - b.rank || a.i - b.i);
    const items = hits.slice(0, MAX_SEARCH_HITS).map((h) => ({ ...h.c }));
    trace(kino2, "live", "search_done", { q, indexed: channels.size, hits: items.length, complete });
    return { items, complete };
  }
  const genreCategories = async (deadline) => storedGenreCategories() ?? genreCategoriesOf(await readCategories(deadline));
  async function channelsPage(id, page, size, deadline) {
    const list = await fetchPage(id, page, deadline, size);
    const items = project(list, id, false);
    noteLogo(id, items);
    return { items, full: list.length >= size };
  }
  return { liveCategories: liveCategories2, liveChannels: liveChannels2, categoriesWithin, channelsWithin, liveSearch: liveSearch2, genreCategories, genreLogos, channelsPage, surface };
}

// src/tweakedMd5.js
var K = Object.freeze([
  3614090360,
  3905402710,
  606105819,
  3250441966,
  4118548399,
  1200080426,
  2821735955,
  4249261313,
  1770035416,
  2336552879,
  4294925233,
  2304563134,
  1804603682,
  4254626195,
  2792965006,
  1236535329,
  4129170786,
  3225465664,
  643717713,
  3921069994,
  3593408605,
  38016083,
  3634488961,
  3889429448,
  568446438,
  3275163606,
  4107603335,
  1163531501,
  2850285829,
  4243563512,
  1735328473,
  2368359562,
  4294588738,
  2272392833,
  1839030562,
  4259657740,
  2763975236,
  1272893353,
  4139469664,
  3200236656,
  681279174,
  3936430074,
  3564056709,
  76029189,
  // [42] tweaked: standard d4ef3085
  3654602809,
  3871185381,
  530742520,
  3299628645,
  // [45] tweaked: standard e6db99e5
  4096336452,
  1126891415,
  2878612391,
  4237533241,
  1700485571,
  2399980690,
  4293706877,
  2240044497,
  // [54] tweaked: standard ffeff47d
  1873313359,
  4264355552,
  2734768916,
  1309151649,
  4149444226,
  3174756917,
  765973179,
  3951481745
  // [62] tweaked: standard 2ad7d2bb
]);
var TWEAKED_STEPS = Object.freeze([42, 45, 54, 62]);
var S = [
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21
];
var ROUND1 = [10, 11, 12, 13, 14, 15, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5];
var G = Array.from({ length: 64 }, (_, i) => i < 16 ? ROUND1[i] : i < 32 ? (5 * i + 1) % 16 : i < 48 ? (3 * i + 5) % 16 : 7 * i % 16);
var SALT = new Uint8Array([
  115,
  97,
  108,
  116,
  51,
  51,
  51,
  51,
  61,
  52,
  152,
  13,
  10,
  21,
  50,
  201,
  195,
  130,
  23,
  8,
  192
]);
var rotl = (x, n) => (x << n | x >>> 32 - n) >>> 0;
function compress(state, block, off) {
  const m = new Array(16);
  for (let j = 0; j < 16; j++) {
    const p = off + j * 4;
    m[j] = (block[p] | block[p + 1] << 8 | block[p + 2] << 16 | block[p + 3] << 24) >>> 0;
  }
  let [a, b, c, d] = state;
  for (let i = 0; i < 64; i++) {
    let f;
    if (i < 16) f = b & c | ~b & d;
    else if (i < 32) f = d & b | ~d & c;
    else if (i < 48) f = b ^ c ^ d;
    else f = c ^ (b | ~d);
    const sum = f + a + K[i] + m[G[i]] >>> 0;
    a = d;
    d = c;
    c = b;
    b = b + rotl(sum, S[i]) >>> 0;
  }
  state[0] = state[0] + a >>> 0;
  state[1] = state[1] + b >>> 0;
  state[2] = state[2] + c >>> 0;
  state[3] = state[3] + d >>> 0;
}
function digestHex(bytes) {
  const state = [1732584193, 4023233417, 2562383102, 271733878];
  const len = bytes.length;
  const padLen = (56 - (len + 1) % 64 + 64) % 64;
  const total = new Uint8Array(len + 1 + padLen + 8);
  total.set(bytes, 0);
  total[len] = 128;
  const low = len % 536870912 * 8;
  const high = Math.floor(len / 536870912);
  for (let i = 0; i < 4; i++) {
    total[len + 1 + padLen + i] = low >>> 8 * i & 255;
    total[len + 5 + padLen + i] = high >>> 8 * i & 255;
  }
  for (let off = 0; off < total.length; off += 64) compress(state, total, off);
  let out = "";
  for (const w of state) for (let i = 0; i < 4; i++) out += (w >>> 8 * i & 255).toString(16).padStart(2, "0");
  return out;
}
function signO3(token, startMomentMs) {
  const head = new TextEncoder().encode(
    `token=${token}&sign2_method=sign_o3&instance=0&start_moment=${startMomentMs}`
  );
  const msg = new Uint8Array(head.length + SALT.length);
  msg.set(head, 0);
  msg.set(SALT, head.length);
  return digestHex(msg);
}

// src/liveSign.js
var MAX_CONTEXT_CHARS = 4096;
var TOKEN = /token=([0-9A-Fa-f]{32})/;
var HEX32 = /^[0-9A-Fa-f]{32}$/;
var URL_AUTHORITY = /^[A-Za-z][A-Za-z0-9+.-]*:\/\/([^/?#]*)/;
function tokenOf(authBase) {
  const m = TOKEN.exec(typeof authBase === "string" ? authBase : "");
  return m ? m[1] : "";
}
var normalize = (authority) => String(authority).toLowerCase().replace(/:80$/, "");
function authorityOf(url) {
  const m = URL_AUTHORITY.exec(typeof url === "string" ? url : "");
  if (!m) return "";
  const at = m[1].lastIndexOf("@");
  return normalize(at >= 0 ? m[1].slice(at + 1) : m[1]);
}
function buildSignContext(license, cdns, builtAtMs) {
  const built = Number.isFinite(builtAtMs) ? { b: Math.trunc(builtAtMs / 1e3) } : {};
  const encode2 = (list, withToken) => JSON.stringify({
    l: license,
    c: list.map((d) => withToken ? { h: d.cflHost, a: d.authBase, t: tokenOf(d.authBase) } : { h: d.cflHost, a: d.authBase }),
    ...built
  });
  const full = encode2(cdns, true);
  if (full.length <= MAX_CONTEXT_CHARS) return { context: full, kept: cdns };
  for (let n = cdns.length; n >= 1; n--) {
    const kept = cdns.slice(0, n);
    const context = encode2(kept, false);
    if (context.length <= MAX_CONTEXT_CHARS) return { context, kept };
  }
  return null;
}
var signError = (why, message) => Object.assign(new Error(message), { why });
function readContext(context) {
  let ctx;
  try {
    ctx = JSON.parse(context);
  } catch (_) {
    ctx = null;
  }
  const ok = ctx && typeof ctx === "object" && typeof ctx.l === "string" && Array.isArray(ctx.c) && ctx.c.length > 0 && ctx.c.every((d) => d && typeof d.h === "string" && typeof d.a === "string");
  if (!ok) throw signError("context", "live signContext is not readable");
  return ctx;
}
function signRequest({ url, context }, nowMs) {
  const ctx = readContext(context);
  const want = authorityOf(url);
  const cdn = ctx.c.find((d) => normalize(d.h) === want) || ctx.c[0];
  const token = typeof cdn.t === "string" && HEX32.test(cdn.t) ? cdn.t : tokenOf(cdn.a);
  if (token === "") throw signError("no_token", "live CDN entry without a token");
  const moment = Math.trunc(nowMs);
  return {
    headers: {
      "Content-Auth": `${cdn.a}&sign2_method=sign_o3&instance=0&start_moment=${moment}&sign2=${signO3(token, moment)}`,
      "Content-License": ctx.l,
      "User-Agent": LIVE_USER_AGENT,
      App: LIVE_APP,
      "App-Version": LIVE_APP_VERSION,
      "X-Buffer": LIVE_X_BUFFER
    }
  };
}

// src/liveRotation.js
var MAX_ROTATIONS = 3;
var ROTATION_TTL_MS = 30 * 6e4;
var MAX_CARRIED_REFUSALS = 16;
var MAX_CHANNELS = 12;
var PREFIX2 = "liveRot:";
var CARRIED_KEY = "liveRotCarried";
var empty = (now) => ({ tried: [], excluded: [], active: null, last: null, at: now, started: now, exhausted: false });
var strings = (a) => Array.isArray(a) ? a.filter((s) => typeof s === "string") : [];
function makeLiveRotation({ kino: kino2, clock: clock2, random, maxRotations = MAX_ROTATIONS, ttlMs = ROTATION_TTL_MS }) {
  const memory = /* @__PURE__ */ new Map();
  let carriedMemory;
  const keyOf = (channel) => PREFIX2 + channel;
  const inWindow = (since) => {
    const age = clock2.now() - since;
    return age >= 0 && age < ttlMs;
  };
  const fresh = (state) => Boolean(state) && inWindow(state.started);
  const ttlLeft = (since) => Math.max(1, ttlMs - Math.max(0, clock2.now() - since));
  const digest = (key) => {
    try {
      const d = kino2.crypto.hash("md5", String(key));
      return typeof d === "string" && d !== "" ? d.slice(0, 16) : null;
    } catch (_) {
      return null;
    }
  };
  function parse(raw) {
    try {
      const o = JSON.parse(raw);
      if (!o || typeof o !== "object" || !Array.isArray(o.t)) return null;
      const at = typeof o.at === "number" ? o.at : 0;
      return {
        tried: strings(o.t),
        excluded: strings(o.x),
        active: typeof o.a === "string" ? o.a : null,
        last: typeof o.k === "string" ? o.k : null,
        at,
        started: typeof o.s === "number" ? o.s : at,
        // an older entry has no start: its last write
        exhausted: o.e === true
      };
    } catch (_) {
      return null;
    }
  }
  function read(channel) {
    const mem = memory.get(channel);
    if (mem) {
      if (fresh(mem)) return mem;
      memory.delete(channel);
    }
    let raw = null;
    try {
      raw = kino2.storage.get(keyOf(channel));
    } catch (_) {
    }
    const stored = typeof raw === "string" ? parse(raw) : null;
    if (!fresh(stored)) return null;
    remember(channel, stored);
    return stored;
  }
  function remember(channel, state) {
    memory.delete(channel);
    memory.set(channel, state);
    while (memory.size > MAX_CHANNELS) memory.delete(memory.keys().next().value);
  }
  function evictFor(channel) {
    try {
      const own = keyOf(channel);
      const keys = kino2.storage.keys().filter((k) => k.startsWith(PREFIX2) && k !== own);
      if (keys.length < MAX_CHANNELS) return;
      const aged = keys.map((k) => {
        let at = 0;
        try {
          at = parse(kino2.storage.get(k))?.at ?? 0;
        } catch (_) {
        }
        return { k, at };
      }).sort((x, y) => x.at - y.at);
      for (const { k } of aged.slice(0, keys.length - MAX_CHANNELS + 1)) kino2.storage.remove(k);
    } catch (_) {
    }
  }
  function write(channel, state) {
    state.at = clock2.now();
    remember(channel, state);
    try {
      let exists = false;
      try {
        exists = kino2.storage.get(keyOf(channel)) !== null;
      } catch (_) {
      }
      if (!exists) evictFor(channel);
      const o = { t: state.tried, a: state.active, k: state.last, at: state.at, s: state.started };
      if (state.excluded.length > 0) o.x = state.excluded;
      if (state.exhausted) o.e = true;
      kino2.storage.set(keyOf(channel), JSON.stringify(o), { ttlMs: ttlLeft(state.started) });
    } catch (_) {
    }
  }
  function carried() {
    if (carriedMemory === void 0) {
      carriedMemory = null;
      try {
        const raw = kino2.storage.get(CARRIED_KEY);
        const o = typeof raw === "string" ? JSON.parse(raw) : null;
        if (o && typeof o.a === "string" && typeof o.at === "number") carriedMemory = { sn: o.a, at: o.at, refused: strings(o.r) };
      } catch (_) {
      }
    }
    return carriedMemory && inWindow(carriedMemory.at) ? carriedMemory : null;
  }
  function setCarried(value) {
    carriedMemory = value;
    try {
      if (value === null) kino2.storage.remove(CARRIED_KEY);
      else kino2.storage.set(CARRIED_KEY, JSON.stringify({ a: value.sn, at: value.at, r: value.refused }), { ttlMs: ttlLeft(value.at) });
    } catch (_) {
    }
  }
  function activeSn(channel) {
    const state = read(channel);
    if (state) return state.active;
    return carried()?.sn ?? null;
  }
  const triedCount = (channel) => read(channel)?.tried.length ?? 0;
  function refuse(channel, currentSn, pool, refusedKey) {
    let state = read(channel);
    if (!state) {
      state = empty(clock2.now());
      const c2 = carried();
      if (c2) {
        state.active = c2.sn;
        state.excluded = c2.refused.slice();
      }
    }
    if (state.exhausted) return "already_exhausted";
    const key = digest(refusedKey);
    if (key !== null && state.last === key) return "repeated";
    state.last = key;
    const refused = state.active ?? currentSn;
    if (!state.tried.includes(refused)) state.tried.push(refused);
    const rotationsSoFar = state.tried.length - 1;
    let next = null;
    if (rotationsSoFar < maxRotations) {
      const candidates = (Array.isArray(pool) ? pool : []).filter((e) => e && !isBlank(e.sn) && !state.tried.includes(e.sn) && !state.excluded.includes(e.sn));
      if (candidates.length > 0) next = candidates[Math.min(candidates.length - 1, Math.floor(random() * candidates.length))].sn;
    }
    state.active = next;
    const c = carried();
    let outcome;
    if (next !== null) {
      const refusedSns = c ? c.refused.slice() : [];
      if (!refusedSns.includes(refused)) refusedSns.push(refused);
      setCarried({ sn: next, at: clock2.now(), refused: refusedSns.slice(-MAX_CARRIED_REFUSALS) });
      outcome = "rotated";
    } else {
      state.exhausted = true;
      if (c && state.tried.includes(c.sn)) setCarried(null);
      outcome = "exhausted";
    }
    write(channel, state);
    return outcome;
  }
  function onRefused(channel, currentSn, pool, refusedKey) {
    const outcome = refuse(channel, currentSn, pool, refusedKey);
    if (outcome === "rotated") return true;
    if (outcome === "repeated") return activeSn(channel) !== null;
    return false;
  }
  return { activeSn, triedCount, refuse, onRefused };
}

// src/live.js
var OUTCOME_WORDS = { already_exhausted: "spent" };
var DEFAULT_TTL_S = 300;
var MIN_EXPIRES_S = 30;
var MAX_EXPIRES_S = 86400;
var MAX_ALTERNATE_HOSTS = 6;
var NOT_LOGGED_IN = "aaa100028";
var INT8 = /^[+-]?\d+$/;
var ALTERNATE_HOST = /^[A-Za-z0-9.-]{1,253}(:[0-9]{1,5})?$/;
var SERVED_MEMORY = 64;
var SLB_RESERVE_MS = 3e3;
var TEXT = {
  noAddresses: "No se pudo abrir el canal: Xuper no dio la direcci\xF3n de la se\xF1al",
  // live_no_addresses
  noCdn: "No se pudo abrir el canal: Xuper no dio un servidor de vivo",
  // live_no_cfl_cdn
  noLicense: "No se pudo abrir el canal: Xuper no dio la licencia de la se\xF1al",
  // live_no_license
  noToken: "No se pudo abrir el canal: el servidor de vivo no trae su token",
  // live_no_cfl_token
  badHost: "No se pudo abrir el canal: Xuper dio una direcci\xF3n de servidor de vivo que no es v\xE1lida",
  tooLong: "No se pudo abrir el canal: los datos de la se\xF1al son demasiado largos",
  unknownChannel: "No se encontr\xF3 ese canal en Xuper",
  generic: "Xuper no est\xE1 disponible ahora"
};
function bareHost(mainAddr) {
  let s = typeof mainAddr === "string" ? mainAddr : "";
  if (s.startsWith("https://")) s = s.slice(8);
  if (s.startsWith("http://")) s = s.slice(7);
  const slash = s.indexOf("/");
  return slash >= 0 ? s.slice(0, slash) : s;
}
function signalFrom(play) {
  let firstLicense = null;
  for (const a of objects(isObject(play) ? play.liveAddressList : null)) {
    const license = optStringStrict(a.license);
    const playCode = optStringStrict(a.playCode);
    if (firstLicense === null) firstLicense = license;
    if (notBlank(playCode) && notBlank(license)) return { playCode, license };
  }
  return firstLicense === null ? null : { playCode: "", license: firstLicense };
}
function liveCdns(slb) {
  const out = [];
  for (const cdn of objects(isObject(slb) ? slb.cdn_list : null)) {
    if (optStringStrict(cdn.tag) !== "live") continue;
    for (const u of objects(cdn.url_list)) {
      const url = optStringStrict(u.url);
      if (!isCfl(url) && optStringStrict(u.sign_type) !== "cfl") continue;
      const host = bareHost(optStringStrict(cdn.main_addr));
      if (notBlank(host)) out.push({ cflHost: host, authBase: url });
    }
  }
  return out;
}
function expiresOf(slb) {
  const text2 = optStringStrict(isObject(slb) ? slb.invalidTime : "");
  const n = INT8.test(text2) ? Number(text2) : NaN;
  const ttl = n > 0 ? n : DEFAULT_TTL_S;
  return Math.min(MAX_EXPIRES_S, Math.max(MIN_EXPIRES_S, ttl));
}
function makeLive({ kino: kino2, portal, session, clock: clock2, config, random }) {
  const rand = random || (() => parseInt(kino2.crypto.randomBytes(4, "hex"), 16) / 4294967296);
  const rotation = makeLiveRotation({ kino: kino2, clock: clock2, random: rand });
  const served = /* @__PURE__ */ new Map();
  const unavailable = (text2) => kino2.error("unavailable", text2);
  const bad = (why, text2) => {
    trace(kino2, "live", "bad", { why });
    return unavailable(text2);
  };
  const channelNotFound = (e) => e.code === "not_found" ? kino2.error("not_found", TEXT.unknownChannel) : e;
  const surface = (e) => {
    if (e instanceof PortalError) return channelNotFound(mapPortalError(e.code, e.message, kino2));
    if (isKinoError(e)) return channelNotFound(e);
    return unavailable(TEXT.generic);
  };
  function noteServed(code, license) {
    served.delete(code);
    served.set(code, license);
    while (served.size > SERVED_MEMORY) served.delete(served.keys().next().value);
  }
  async function open(code, seed, deadline) {
    let lastCode = null;
    let call;
    if (seed) {
      call = (path, bean, by) => portal.call(path, bean, { baseFields: true, userId: seed.userId, userToken: seed.userToken, sn: seed.sn, deadline: by });
    } else {
      await session.ensure({ deadline: deadline - SLB_RESERVE_MS });
      call = (path, bean, by) => session.withValidSession(async ({ userId, userToken }) => {
        try {
          return await portal.call(path, bean, { baseFields: true, userId, userToken, deadline: by });
        } catch (e) {
          lastCode = e instanceof PortalError ? e.code : null;
          throw e;
        }
      }, { deadline: by });
    }
    let play;
    try {
      play = await call("v4/startPlayLive", { channelCode: code, columnId: 0, type: "1" }, deadline - SLB_RESERVE_MS);
    } catch (e) {
      trace(kino2, "live", "open_fail", { step: "play", code: lastCode ?? errCode(e), seed: !!seed });
      const notLoggedIn = e instanceof PortalError && e.code === NOT_LOGGED_IN || isKinoError(e) && e.code === "auth_required" && lastCode === NOT_LOGGED_IN;
      if (notLoggedIn && !(isKinoError(e) && ACCOUNT_SENTENCES.has(e.userMessage))) {
        throw kino2.error("auth_required", "el canal necesita una cuenta (aaa100028)", { userMessage: say(kino2, "liveNeedsAccount") });
      }
      throw e;
    }
    const signal = signalFrom(play);
    if (!signal) throw bad("no_address", TEXT.noAddresses);
    lastCode = null;
    let slb;
    try {
      slb = await call("v14/getSlbInfo", slbBean(config.apkVersion, [code]), deadline);
    } catch (e) {
      trace(kino2, "live", "open_fail", { step: "slb", code: lastCode ?? errCode(e), seed: !!seed });
      throw e;
    }
    const all = liveCdns(slb);
    if (all.length === 0) throw bad("no_cdn", TEXT.noCdn);
    if (!notBlank(signal.license)) throw bad("no_license", TEXT.noLicense);
    const withToken = all.filter((d) => tokenOf(d.authBase) !== "");
    if (withToken.length === 0) throw bad("no_token", TEXT.noToken);
    const cdns = withToken.filter((d) => ALTERNATE_HOST.test(d.cflHost));
    if (cdns.length === 0) throw bad("bad_cdn", TEXT.badHost);
    const built = buildSignContext(signal.license, cdns, clock2.now());
    if (!built) throw bad("too_long", TEXT.tooLong);
    if (built.kept.length < cdns.length) trace(kino2, "live", "cdn_cut", { kept: built.kept.length, of: cdns.length });
    const primary = built.kept[0].cflHost;
    const alternates = [];
    for (const d of built.kept.slice(1)) {
      if (d.cflHost.toLowerCase() === primary.toLowerCase() || alternates.some((h) => h.toLowerCase() === d.cflHost.toLowerCase())) continue;
      if (alternates.length < MAX_ALTERNATE_HOSTS) alternates.push(d.cflHost);
    }
    const playCode = notBlank(signal.playCode) ? signal.playCode : code;
    noteServed(code, signal.license);
    const primaryIndex = all.indexOf(built.kept[0]);
    trace(kino2, "live", "open", { cdns: all.length, kept: built.kept.length, primary: primaryIndex, alts: alternates.length, seed: !!seed, exp: expiresOf(slb) });
    if (primaryIndex > 0) report(kino2, "live_cdn", "skip", { primary: primaryIndex, of: all.length });
    return {
      url: `http://${primary}/live/${playCode}.m3u8`,
      mime: "application/x-mpegurl",
      signing: "request",
      signContext: built.context,
      alternateHosts: alternates,
      expiresInSeconds: expiresOf(slb)
    };
  }
  const sessOf = () => {
    try {
      return typeof session.mode === "function" ? session.mode() : "?";
    } catch (_) {
      return "?";
    }
  };
  const seedBySn = (sn) => sn === null ? null : session.seedPool().find((e) => e.sn === sn) || null;
  function onConflict(code, attempt) {
    const kind = session.kind();
    if (kind !== "seed") {
      trace(kino2, "live", "conflict", { sess: sessOf(), outcome: "no_rotation" });
      return;
    }
    const current = rotation.activeSn(code) ?? session.current().sn;
    const refusedKey = served.has(code) ? served.get(code) : `retry:${attempt}`;
    const outcome = rotation.refuse(code, current, session.seedPool(), refusedKey);
    trace(kino2, "live", "conflict", { sess: sessOf(), outcome: OUTCOME_WORDS[outcome] ?? outcome, tried: rotation.triedCount(code), of: MAX_ROTATIONS + 1 });
    report(kino2, "live_rotation", "conflict", { outcome: OUTCOME_WORDS[outcome] ?? outcome, tried: rotation.triedCount(code), of: MAX_ROTATIONS + 1 });
  }
  async function openWithRotation(code, deadline) {
    let seed = session.kind() === "seed" ? seedBySn(rotation.activeSn(code)) : null;
    if (!seed) return open(code, null, deadline);
    for (let i = 0; i < MAX_ROTATIONS + 1; i++) {
      try {
        return await open(code, seed, deadline);
      } catch (e) {
        trace(kino2, "live", "seed_fail", { seed: seedTag(kino2, seed.sn), code: errCode(e) });
        const moved = rotation.refuse(code, seed.sn, session.seedPool(), `resolve:${seed.sn}`) === "rotated";
        const next = seedBySn(rotation.activeSn(code));
        if (!next || !moved) return open(code, null, deadline);
        seed = next;
      }
    }
    return open(code, null, deadline);
  }
  async function resolveLive(code, options) {
    await null;
    const deadline = callDeadline(clock2, CALL_BUDGET_MS.resolve);
    try {
      const retry = isObject(options) && isObject(options.retry) ? options.retry : null;
      if (retry) trace(kino2, "live", "retry", { reason: typeof retry.reason === "string" ? retry.reason : "?", attempt: retry.attempt, status: Number.isInteger(retry.status) ? retry.status : void 0 });
      if (retry && retry.reason === "conflict") onConflict(code, retry.attempt);
      return await openWithRotation(code, deadline);
    } catch (e) {
      throw surface(e);
    }
  }
  return { resolveLive };
}

// src/section.js
var TABS = [
  { id: "peliculas", label: "Pel\xEDculas" },
  { id: "series", label: "Series" },
  { id: "infantil", label: "Infantil" },
  { id: "anime", label: "Anime" }
];
var TAB_LABELS_EN = Object.freeze({ peliculas: "Movies", series: "Series", infantil: "Kids", anime: "Anime" });
var MAX_HERO_TEXT = 300;
var rowsOfTab = (rows, tab, nowMs, idsOf = void 0, english = false, spanish = false) => projectRows(rows.filter((r) => rootOfRow(r.id) === tab), nowMs, idsOf, english, spanish);
function heroOf(rows) {
  for (const row2 of rows) {
    for (const item of row2.items) {
      if (item.adult === true || !item.backdrop || typeof item.overview !== "string" || item.overview.trim() === "") continue;
      const text2 = item.overview.trim();
      return {
        title: item.title,
        text: text2.length <= MAX_HERO_TEXT ? text2 : `${text2.slice(0, MAX_HERO_TEXT - 1).trimEnd()}\u2026`,
        image: item.backdrop
      };
    }
  }
  return null;
}
function makeSection({ kino: kino2, catalog, clock: clock2 }) {
  async function section2(arg) {
    const asked = arg !== null && typeof arg === "object" ? arg.tab : null;
    const tab = asked === null || asked === void 0 || asked === "" ? TABS[0].id : asked;
    if (!TABS.some((t) => t.id === tab)) throw kino2.error("not_found", "No se encontr\xF3 esa pesta\xF1a");
    const rows = await catalog.rows("section", tab);
    const idsOf = typeof catalog.idsLookup === "function" ? catalog.idsLookup() : void 0;
    const english = isEnglish(kino2);
    const tabRows = rowsOfTab(rows, tab, clock2.now(), idsOf, english, isSpanish(kino2));
    const hero = heroOf(tabRows);
    const tabs = TABS.map((t) => ({ id: t.id, label: english ? TAB_LABELS_EN[t.id] : t.label }));
    return { tabs, tab, ...hero ? { hero } : {}, rows: tabRows };
  }
  return { section: section2 };
}

// src/categories.js
var MAX_CATEGORIES2 = 24;
var MAX_TITLE = 40;
function tilesOf(rows, english = false) {
  const out = [];
  for (const r of rows) {
    if (out.length >= MAX_CATEGORIES2) break;
    if (r.shown.length === 0) continue;
    const first = r.shown[0];
    const art = first.backdrop && first.backdrop.trim() || first.poster && first.poster.trim() || null;
    const tile = { id: r.id, title: localizedRowTitle(r, english).slice(0, MAX_TITLE), ref: r.id };
    if (art) tile.art = art;
    out.push(tile);
  }
  return out;
}
var ADULT_TILE = Object.freeze({ id: ADULT_REF, title: "18+", ref: ADULT_REF, adult: true });
function makeCategories({ catalog, kino: kino2 = null, liveTiles = null }) {
  return {
    // An empty catalog stays empty: an 18+ tile alone would be the only thing Xuper offers. Live tiles alone
    // are shown (the VOD catalog failing must not hide them, nor they it: tiles() never throws).
    categories: async () => {
      const [rows, live2] = await Promise.all([
        catalog.rows("categories").then((r) => ({ r }), (e) => ({ e })),
        liveTiles ? liveTiles.tiles() : Promise.resolve([])
      ]);
      if (rows.e && live2.length === 0) throw rows.e;
      const tiles = rows.e ? [] : tilesOf(rows.r, isEnglish(kino2));
      if (tiles.length === 0) return live2;
      return [...tiles.slice(0, MAX_CATEGORIES2 - 1 - live2.length), ...live2, { ...ADULT_TILE }];
    }
  };
}

// src/seedContrib.js
var CONTRIB_INTERVAL_MS = 10 * 36e5;
var VALIDATE_COLUMN = "masnew_movies";
var REQUEST_MS = 1e4;
var TOTAL_MS = 25e3;
var HOME_CONTRIB_END_MS = 15e3;
var CONTRIB_WINDOW_MS = 8e3;
var MIN_WINDOW_MS = 4e3;
var AT_KEY = "seedContribAt";
var CONTRIBUTE_SETTING = "contributeSeeds";
var OPTIONAL_EXTRAS = ["customer", "activeTime", "availableTime"];
var str4 = (v) => typeof v === "string" ? v : v === null || v === void 0 ? "" : String(v);
function hasRealData(col) {
  if (col === null || typeof col !== "object") return false;
  if (Array.isArray(col)) return col.length > 0;
  return Object.keys(col).length > 0;
}
function makeSeedContrib({ kino: kino2, portal, clock: clock2 }) {
  const fingerprint = makeFingerprint(kino2);
  let running = false;
  const enabled = () => {
    try {
      return kino2.config.get(CONTRIBUTE_SETTING) !== false;
    } catch (_) {
      return true;
    }
  };
  const readAt = () => {
    try {
      const v = Number(kino2.storage.get(AT_KEY));
      return Number.isFinite(v) && v > 0 ? v : null;
    } catch (_) {
      return null;
    }
  };
  const stampAt = (now) => {
    try {
      kino2.storage.set(AT_KEY, String(now));
    } catch (_) {
    }
  };
  async function mintAnonymous(deadline) {
    const bounds = { timeoutMs: REQUEST_MS, deadline: Math.min(clock2.now() + TOTAL_MS, deadline) };
    try {
      const mint = await portal.call("v3/snToken", fingerprint(), { baseFields: false, ...bounds });
      if (blank(mint && mint.snToken)) {
        trace(kino2, "seed_contrib", "mint", { ok: false, why: "no_sntoken" });
        return null;
      }
      const snToken = str4(mint.snToken);
      const sn = snFrom(kino2, mint, snToken);
      const act = await portal.call("v8/active", activateBean(snToken), { baseFields: false, sn, ...bounds });
      if (blank(act && act.userToken) || blank(act && act.userId)) {
        trace(kino2, "seed_contrib", "mint", { ok: false, why: "no_token" });
        return null;
      }
      const col = await portal.call(
        "getNextColumns",
        { columnCode: VALIDATE_COLUMN, pageNum: 1, pageSize: 1, version: "" },
        { baseFields: true, userId: str4(act.userId), userToken: str4(act.userToken), sn, ...bounds }
      );
      if (!hasRealData(col)) {
        trace(kino2, "seed_contrib", "validate", { ok: false, why: "empty" });
        return null;
      }
      return buildSeed(sn, act);
    } catch (e) {
      if (e instanceof PortalError || isKinoError(e)) {
        trace(kino2, "seed_contrib", "mint", { ok: false, code: errCode(e) });
        return null;
      }
      trace(kino2, "seed_contrib", "mint", { ok: false, why: "bug", code: errCode(e) });
      return null;
    }
  }
  function buildSeed(sn, act) {
    const seed = {
      sn,
      userId: str4(act.userId),
      userToken: str4(act.userToken),
      jwtToken: str4(act.jwtToken || ""),
      mintedAt: Math.floor(clock2.now() / 1e3)
    };
    for (const k of OPTIONAL_EXTRAS) {
      const v = act[k];
      if (typeof v === "string" && v !== "") seed[k] = v;
      else if (typeof v === "number" && Number.isFinite(v)) seed[k] = v;
    }
    return seed;
  }
  async function maybeContribute({ deadline = Infinity } = {}) {
    if (running) return null;
    running = true;
    try {
      if (typeof kino2.seed !== "function") return null;
      if (!enabled()) {
        trace(kino2, "seed_contrib", "skip", { why: "off" });
        return null;
      }
      const now = clock2.now();
      const last = readAt();
      if (last !== null && now - last >= 0 && now - last < CONTRIB_INTERVAL_MS) {
        trace(kino2, "seed_contrib", "skip", { why: "rate" });
        return null;
      }
      const end = Math.min(now + TOTAL_MS, Number.isFinite(deadline) ? deadline : Infinity);
      if (end - now < MIN_WINDOW_MS) {
        trace(kino2, "seed_contrib", "skip", { why: "time" });
        return null;
      }
      stampAt(now);
      const seed = await mintAnonymous(end);
      if (!seed) return null;
      try {
        kino2.seed(seed);
      } catch (_) {
      }
      trace(kino2, "seed_contrib", "done", { ok: 1, jwt: seed.jwtToken ? 1 : 0 });
      return seed;
    } catch (_) {
      return null;
    } finally {
      running = false;
    }
  }
  const afterHome = (homeStartedAt) => maybeContribute({
    deadline: Math.min(clock2.now() + CONTRIB_WINDOW_MS, homeStartedAt + HOME_CONTRIB_END_MS)
  });
  return { maybeContribute, afterHome };
}

// src/wiring.js
var deps = null;
var clock = { now: () => Date.now() };
function getDeps() {
  if (deps) return deps;
  const crypto = makeCrypto(kino, { onDecode: makeDecodeReporter(kino) });
  const config = { hosts, appId: APP_ID, apkVersion: APK_VERSION };
  let session = null;
  const portal = makePortal({ kino, crypto, config, clock, snProvider: () => session.current().sn, modeOf: () => session.mode() });
  session = makeSession({ kino, portal, clock, shared: { email: SHARED_EMAIL, password: SHARED_PASSWORD } });
  const tmdb = makeTmdb({ kino, clock });
  const live2 = makeLiveCatalog({ kino, portal, session, clock });
  const catalog = makeCatalog({ kino, portal, session, clock, tmdb, countryRow: makeCountryRow({ kino, live: live2 }) });
  const liveStream = makeLive({ kino, portal, session, clock, config });
  const resolve2 = makeResolve({ kino, portal, session, clock, config, portalChapters: catalog.portalChapters, live: liveStream });
  const section2 = makeSection({ kino, catalog, clock });
  const liveTiles = makeLiveTiles({ kino, live: live2, clock });
  const categories2 = makeCategories({ catalog, kino, liveTiles });
  const seedContrib = makeSeedContrib({ kino, portal, clock });
  deps = { clock, crypto, portal, session, tmdb, catalog, resolve: resolve2, live: live2, liveStream, section: section2, categories: categories2, liveTiles, seedContrib };
  return deps;
}
async function guarded(body) {
  try {
    return await body(getDeps());
  } catch (e) {
    if (isKinoError(e)) throw e;
    trace(kino, "call", "bug", { code: errCode(e) });
    throw kino.error("unavailable", "Xuper no est\xE1 disponible ahora");
  }
}

// src/migrate.js
var LIVE_PROVIDERS = /* @__PURE__ */ new Set(["xuper", "legacy"]);
var ITEM_ID3 = /^[A-Za-z0-9._~-]{1,128}$/;
var MAX_NUMBER = 99999;
var MAX_SEASON = 999;
var whole = (v, max) => Number.isInteger(v) && v >= 1 && v <= max ? v : null;
function ownRef(ref) {
  if (typeof ref !== "string" || ref.startsWith("plg1:")) return null;
  return decode(ref);
}
function title(input) {
  const magis = ownRef(input.ref);
  if (!magis || !ITEM_ID3.test(magis.contentId)) return null;
  return {
    kind: magis.isSeries ? "series" : "movie",
    id: magis.contentId,
    ref: encode({ contentId: magis.contentId, programType: magis.programType, episode: 0 })
  };
}
function chapter(input) {
  const magis = ownRef(input.ref);
  if (!magis || !ITEM_ID3.test(magis.contentId)) return null;
  const number = whole(magis.episode, MAX_NUMBER) ?? whole(input.episode, MAX_NUMBER) ?? 1;
  const out = { kind: "episode", ref: encodeChapter(number, magis.contentId), number };
  const season = whole(input.season, MAX_SEASON);
  if (season !== null) out.season = season;
  return out;
}
function live(input) {
  if (!LIVE_PROVIDERS.has(input.provider)) return null;
  const id = typeof input.code === "string" ? idOfCode(input.code) : null;
  return id === null ? null : { kind: "live", code: id };
}
function makeMigrate() {
  async function migrate2(input) {
    await null;
    try {
      if (!isObject(input)) return null;
      if (input.kind === "title") return title(input);
      if (input.kind === "chapter") return chapter(input);
      if (input.kind === "live") return live(input);
      return null;
    } catch (_) {
      return null;
    }
  }
  return { migrate: migrate2 };
}

// src/settings.js
var STATUS_MAX = 200;
var MESSAGE_MAX = 300;
var VALIDATE_REQUEST_MS = 12e3;
var VALIDATE_TOTAL_MS = 17e3;
var LOGIN_REQUEST_MS = 12e3;
var LOGIN_TOTAL_MS = 25e3;
var SEED_PROBE_MS = 5e3;
var SEED_SWITCH_TOTAL_MS = 22e3;
var SEED_DOWNLOAD_MS = 1e4;
var SEND_CODE_REQUEST_MS = 1e4;
var SEND_CODE_TOTAL_MS = 25e3;
var RESEND_WAIT_MS = 6e4;
var REGISTER_REQUEST_MS = 1e4;
var REGISTER_TOTAL_MS = 25e3;
var LOGOUT_REQUEST_MS = 1e4;
var LOGOUT_TOTAL_MS = 25e3;
var str5 = (v) => typeof v === "string" ? v : v === null || v === void 0 ? "" : String(v);
var clip = (text2, max) => text2.length <= max ? text2 : text2.slice(0, max - 1) + "\u2026";
var refusedCredentials = (e) => e !== null && typeof e === "object" && (e.name === "KinoError_auth_required" || e.name === "PortalError");
function makeSettings({ kino: kino2, session, clock: clock2, registration }) {
  const surface = (e) => {
    const named = namedCause(kino2, e);
    if (named) return named;
    if (isKinoError(e)) return e;
    trace(kino2, "settings", "fail", { code: errCode(e) });
    return kino2.error("unavailable", "Xuper no est\xE1 disponible ahora");
  };
  const savedAccount = () => configuredPair(kino2.config);
  async function settingsStatus2() {
    await null;
    try {
      const account = session.kind() === "account";
      const state = session.accountState();
      const shared = session.sharedConfigured();
      const anonymous = state === "pending" ? say(kino2, "statusConnecting", { who: say(kino2, shared ? "whoShared" : "whoOwn") }) : state === "refused" ? say(kino2, shared ? "statusSharedBroken" : "statusOwnRefused") : say(kino2, "statusAnonymous");
      const who = session.usingShared() ? say(kino2, "statusShared") : say(kino2, "statusConnectedAs", { email: savedAccount().email });
      const parts = [account ? who : anonymous];
      if (!account && session.regionBlocked()) {
        const n = session.seedPool().length;
        parts.push(n > 0 ? say(kino2, "statusBlockedSeeds", { n }) : say(kino2, "statusBlockedNoSeeds"));
        if (session.seedsExhausted()) parts.push(say(kino2, "seedsBanner"));
        else if (kino2.config.get("autoRefreshSeeds") === false) parts.push(say(kino2, "statusAutoRefreshOff"));
      }
      const text2 = parts.length === 1 ? parts[0] : parts.join(". ") + ".";
      return { status: clip(text2, STATUS_MAX) };
    } catch (_) {
      return { status: say(kino2, "statusUnknown") };
    }
  }
  async function login() {
    const { email, password } = savedAccount();
    if (email === "" || password === "") throw told(kino2, "auth_required", "Escribe tu correo y contrase\xF1a en Ajustes", say(kino2, "fillAccount"));
    const bounds = { timeoutMs: LOGIN_REQUEST_MS, deadline: clock2.now() + LOGIN_TOTAL_MS };
    try {
      await session.login(email, password, bounds);
    } catch (e) {
      const named = namedCause(kino2, e);
      if (named) throw named;
      throw refusedCredentials(e) ? told(kino2, "auth_required", "Credenciales de Xuper inv\xE1lidas", say(kino2, "accountRefused")) : surface(e);
    }
    return { message: say(kino2, "signedIn"), refresh: true };
  }
  async function logout() {
    try {
      await session.logout({ timeoutMs: LOGOUT_REQUEST_MS, deadline: clock2.now() + LOGOUT_TOTAL_MS });
    } catch (e) {
      throw surface(e);
    }
    return { message: say(kino2, "signedOut"), refresh: true, clearSettings: ["email", "password", "regEmail", "regPassword", "useSharedAccount"] };
  }
  async function switchSeed() {
    let r;
    try {
      r = await session.switchSeed({ timeoutMs: SEED_PROBE_MS, deadline: clock2.now() + SEED_SWITCH_TOTAL_MS });
    } catch (e) {
      throw surface(e);
    }
    const message = r.result === "ok" ? say(kino2, "seedSwitched", { n: r.tries }) : r.result === "offline" ? say(kino2, "offlineRetry") : r.result === "account_linked" ? say(kino2, "accountNoSeeds") : r.result === "no_other_seed" ? say(kino2, "noOtherSeed") : say(kino2, "seedsAllFailed", { n: r.tries });
    return { message, refresh: true };
  }
  async function refreshSeeds() {
    let ok;
    try {
      ok = await session.refreshSeeds({ timeoutMs: SEED_DOWNLOAD_MS, manual: true });
    } catch (e) {
      throw surface(e);
    }
    return { message: ok ? say(kino2, "seedsLoaded", { n: session.seedPool().length }) : say(kino2, "offlineRetry"), refresh: true };
  }
  function typedEmail() {
    const { email } = creationFields(kino2.config);
    if (email === "") throw told(kino2, "auth_required", "Escribe tu correo en Ajustes", say(kino2, savesBeforeAction(kino2) ? "fillEmail" : "fillEmailSave"));
    if (!email.includes("@")) throw told(kino2, "auth_required", "Escribe un correo v\xE1lido", say(kino2, "badEmail"));
    return email;
  }
  async function sendCode() {
    const email = typedEmail();
    const prev = registration.pendingFor(email);
    if (prev && prev.at !== null && clock2.now() >= prev.at && clock2.now() - prev.at < RESEND_WAIT_MS) {
      return { message: say(kino2, "codeAlreadySent") };
    }
    const bounds = { timeoutMs: SEND_CODE_REQUEST_MS, deadline: clock2.now() + SEND_CODE_TOTAL_MS };
    try {
      await registration.sendRegistrationCode(email, bounds);
    } catch (e) {
      throw surface(e);
    }
    return { message: say(kino2, savesBeforeAction(kino2) ? "codeSent" : "codeSentSave", { email }) };
  }
  async function register() {
    const email = typedEmail();
    const code = str5(kino2.config.get("verifyCode")).trim();
    if (code === "") throw told(kino2, "auth_required", "Escribe el c\xF3digo de verificaci\xF3n", say(kino2, "fillCode"));
    const { password } = creationFields(kino2.config);
    if (password === "") throw told(kino2, "auth_required", "Escribe tu contrase\xF1a en Ajustes", say(kino2, "fillAccount"));
    const pending = registration.pendingFor(email);
    if (!pending) throw told(kino2, "unavailable", "Pide el c\xF3digo otra vez", say(kino2, "askCodeAgain"));
    const bounds = { timeoutMs: REGISTER_REQUEST_MS, deadline: clock2.now() + REGISTER_TOTAL_MS };
    let done;
    try {
      done = await registration.confirmRegistration(pending, code, password, bounds);
    } catch (e) {
      throw surface(e);
    }
    const message = done && done.loggedIn === false ? say(kino2, "accountCreatedSignIn") : say(kino2, "accountCreatedSignedIn");
    return { message, refresh: true, clearSettings: ["verifyCode", "email", "password"] };
  }
  const ACTIONS = { login, logout, switchSeed, refreshSeeds, ...registration ? { sendCode, register } : {} };
  async function action2(key) {
    await null;
    const run = Object.prototype.hasOwnProperty.call(ACTIONS, key) ? ACTIONS[key] : null;
    if (!run) return null;
    const out = await run();
    return { ...out, message: clip(out.message, MESSAGE_MAX) };
  }
  async function validateSettings2(values) {
    await null;
    const v = values && typeof values === "object" ? values : {};
    const t = (k) => str5(v[k]).trim();
    const email = t("email"), password = t("password");
    const regEmail = t("regEmail"), regPassword = t("regPassword");
    const sharedOn = v.useSharedAccount === true || v.useSharedAccount === "true";
    const hasCreated = regEmail !== "" || regPassword !== "";
    const hasOwn = !hasCreated && (email !== "" || password !== "");
    if (sharedOn && !hasOwn && !hasCreated) {
      const bounds2 = { timeoutMs: VALIDATE_REQUEST_MS, deadline: clock2.now() + VALIDATE_TOTAL_MS };
      try {
        await session.useShared(bounds2);
        return null;
      } catch (e) {
        if (refusedCredentials(e)) return { useSharedAccount: say(kino2, "sharedActivationFailed") };
        throw surface(e);
      }
    }
    if (!hasOwn && !hasCreated) return null;
    const errors = {};
    if (sharedOn) errors.useSharedAccount = say(kino2, "removeAccountOrShared");
    if (hasOwn) {
      if (email === "") errors.email = say(kino2, "enterEmail");
      else if (!email.includes("@")) errors.email = say(kino2, "enterValidEmail");
    }
    if (hasCreated) {
      if (regEmail === "") errors.regEmail = say(kino2, "enterEmail");
      else if (!regEmail.includes("@")) errors.regEmail = say(kino2, "enterValidEmail");
    }
    if (Object.keys(errors).length > 0) return errors;
    const pair = hasOwn && email !== "" && password !== "" ? { email, password, field: "password" } : regEmail !== "" && regPassword !== "" ? { email: regEmail, password: regPassword, field: "regPassword" } : null;
    if (pair === null) return null;
    if (pair.field === "regPassword" && (t("verifyCode") !== "" || registration && registration.pendingFor(pair.email) !== null)) return null;
    const bounds = { timeoutMs: VALIDATE_REQUEST_MS, deadline: clock2.now() + VALIDATE_TOTAL_MS };
    try {
      await session.login(pair.email, pair.password, bounds);
      return null;
    } catch (e) {
      if (refusedCredentials(e)) {
        const creating = t("verifyCode") !== "" || registration !== void 0 && registration !== null && registration.pendingFor(pair.email) !== null;
        return creating ? null : { [pair.field]: say(kino2, "credentialsRefused") };
      }
      throw surface(e);
    }
  }
  return { settingsStatus: settingsStatus2, action: action2, validateSettings: validateSettings2 };
}

// src/registration.js
var PENDING_KEY = "pendingRegistration";
var PENDING_TTL_MS = 30 * 6e4;
var SEND_FAILED = "No se pudo enviar el c\xF3digo: revisa el email";
var NOT_SAVED = "No se pudo guardar el pedido; int\xE9ntalo de nuevo";
var CONFIRM_FAILED = "C\xF3digo inv\xE1lido o cuenta ya registrada";
var str6 = (v) => typeof v === "string" ? v : v === null || v === void 0 ? "" : String(v);
function makeRegistration({ kino: kino2, portal, session, clock: clock2 }) {
  const fingerprint = makeFingerprint(kino2);
  const failure = (e, text2, sentence) => {
    trace(kino2, "register", "fail", { code: errCode(e) });
    const named = namedCause(kino2, e);
    if (named) return named;
    if (e instanceof PortalError) return told(kino2, "unavailable", text2, sentence);
    if (e !== null && typeof e === "object" && typeof e.name === "string" && e.name.startsWith("KinoError_")) return e;
    return kino2.error("unavailable", "Xuper no est\xE1 disponible ahora");
  };
  function pendingFor(email) {
    try {
      const raw = kino2.storage.get(PENDING_KEY);
      const o = raw === null || raw === void 0 ? null : JSON.parse(raw);
      if (!o || typeof o !== "object" || blank(o.userToken) || blank(o.sn) || str6(o.email) !== email) return null;
      return { userId: str6(o.userId), userToken: str6(o.userToken), sn: str6(o.sn), email: str6(o.email), at: typeof o.at === "number" ? o.at : null };
    } catch (_) {
      return null;
    }
  }
  const savePending = (p) => {
    try {
      kino2.storage.set(PENDING_KEY, JSON.stringify(p), { ttlMs: PENDING_TTL_MS });
      return true;
    } catch (_) {
      return false;
    }
  };
  const dropPending = () => {
    try {
      kino2.storage.remove(PENDING_KEY);
    } catch (_) {
    }
  };
  async function sendRegistrationCode(email, bounds = {}) {
    await null;
    try {
      const mint = await portal.call("v3/snToken", fingerprint(), { baseFields: false, ...bounds });
      if (blank(mint && mint.snToken)) throw new PortalError("snToken_failed", "el portal no devolvi\xF3 snToken");
      const snToken = str6(mint.snToken);
      const sn = snFrom(kino2, mint, snToken);
      const act = await portal.call("v8/active", activateBean(snToken), { baseFields: false, sn, ...bounds });
      if (blank(act && act.userToken)) throw new PortalError("active_sin_token", "activaci\xF3n sin userToken");
      const pending = { userId: str6(act.userId), userToken: str6(act.userToken), sn, email, at: clock2.now() };
      await portal.call(
        "v2/sendEmailVerifyCode",
        { email, type: "1", userId: pending.userId, userToken: pending.userToken },
        { baseFields: false, sn, ...bounds }
      );
      if (!savePending(pending)) throw told(kino2, "unavailable", NOT_SAVED, say(kino2, "requestNotSaved"));
      return pending;
    } catch (e) {
      throw failure(e, SEND_FAILED, say(kino2, "sendCodeFailed"));
    }
  }
  async function confirmRegistration(pending, code, password, bounds = {}) {
    await null;
    const { email, userId, userToken, sn } = pending;
    const pwd = kino2.crypto.hash("md5", password + PASSWORD_SALT);
    const opts = { baseFields: false, sn, ...bounds };
    let bound = false;
    try {
      await portal.call("v2/validateVerifyCode", { type: "1", email, verifyCode: code, userToken, userId }, opts);
      await portal.call("v2/bindEmail", { email, pwd, type: "1", userId, userToken }, opts);
      bound = true;
      const j = await portal.call("v8/login", {
        accountType: "2",
        userName: email,
        password: pwd,
        type: "1",
        macAddr: FIXED_MAC,
        areaCode: "",
        verificationCode: "",
        verificationToken: "",
        matadata: "",
        signdata: "",
        channel: "default"
      }, opts);
      if (blank(j && j.userToken)) throw new PortalError("login_sin_token", "login sin userToken");
      await session.adoptSession({ userId: j.userId, userToken: j.userToken, jwtToken: j.jwtToken, sn, acct: session.accountKey(email, password) });
    } catch (e) {
      if (bound) {
        trace(kino2, "register", "bound_not_in", { code: errCode(e) });
        dropPending();
        return { loggedIn: false };
      }
      throw failure(e, CONFIRM_FAILED, say(kino2, "codeRefused"));
    }
    dropPending();
    return { loggedIn: true };
  }
  return { sendRegistrationCode, confirmRegistration, pendingFor };
}

// src/plugin.js
var servedBy = () => getDeps().catalog.servedBy();
async function search(query) {
  await null;
  let scoped = false;
  try {
    scoped = query !== null && typeof query === "object" && query.within !== void 0 && query.within !== null;
  } catch (_) {
    scoped = false;
  }
  return traced(kino, clock, "search", () => guarded(({ catalog }) => catalog.search(query)), scoped ? { scope: "within" } : {}, servedBy);
}
async function home() {
  await null;
  const startedAt = clock.now();
  const out = await traced(kino, clock, "home", () => guarded(({ catalog }) => catalog.home()), {}, servedBy);
  try {
    Promise.resolve(getDeps().seedContrib.afterHome(startedAt)).catch(() => {
    });
  } catch (_) {
  }
  return out;
}
async function browse(ref, cursor) {
  await null;
  const live2 = isLiveTileRef(ref);
  return traced(
    kino,
    clock,
    "browse",
    () => guarded(({ catalog, liveTiles }) => live2 ? liveTiles.browse(ref, cursor) : catalog.browse(ref, cursor)),
    live2 ? { kind: "live" } : {},
    servedBy
  );
}
async function section(arg) {
  await null;
  return traced(kino, clock, "section", () => guarded(({ section: s }) => s.section(arg)), {}, servedBy);
}
async function categories() {
  await null;
  return traced(kino, clock, "categories", () => guarded(({ categories: c }) => c.categories()), {}, servedBy);
}
async function episodes(ref) {
  await null;
  return traced(kino, clock, "episodes", () => guarded(({ catalog }) => catalog.episodes(ref)), {}, servedBy);
}
async function resolve(ref, options) {
  await null;
  return traced(kino, clock, "resolve", () => guarded(({ resolve: resolveRef }) => resolveRef.resolve(ref, options)), { kind: isChannelRef(ref) ? "live" : "vod" }, servedBy);
}
async function sign(request) {
  await null;
  try {
    return signRequest(request, clock.now());
  } catch (e) {
    if (isKinoError(e)) throw e;
    report(kino, "sign", "fail", { why: typeof e?.why === "string" ? e.why : errCode(e) });
    throw kino.error("unavailable", "No se pudo firmar la petici\xF3n del canal");
  }
}
async function liveCategories() {
  await null;
  return traced(kino, clock, "liveCategories", () => guarded(({ live: live2 }) => live2.liveCategories()));
}
async function liveChannels(args) {
  await null;
  return traced(kino, clock, "liveChannels", () => guarded(({ live: live2 }) => live2.liveChannels(args)));
}
async function liveSearch(args) {
  await null;
  return traced(kino, clock, "liveSearch", () => guarded(({ live: live2 }) => live2.liveSearch(args)));
}
var migrator = makeMigrate();
async function migrate(input) {
  await null;
  try {
    return await traced(kino, clock, "migrate", () => migrator.migrate(input), { kind: input && typeof input.kind === "string" ? input.kind : "?" });
  } catch (e) {
    if (isKinoError(e)) throw e;
    report(kino, "migrate", "fail", { code: errCode(e) });
    throw kino.error("unavailable", "Xuper no est\xE1 disponible ahora");
  }
}
var settingsInstance = null;
var settings = () => settingsInstance ?? (settingsInstance = (() => {
  const { session, portal } = getDeps();
  return makeSettings({ kino, session, clock, registration: makeRegistration({ kino, portal, session, clock }) });
})());
async function settingsStatus() {
  await null;
  try {
    return await traced(kino, clock, "settingsStatus", () => settings().settingsStatus());
  } catch (e) {
    trace(kino, "settings", "status_fail", { code: errCode(e) });
    return { status: "No se pudo consultar el estado" };
  }
}
async function action(key) {
  await null;
  try {
    return await traced(kino, clock, "action", () => settings().action(key), { key: typeof key === "string" ? key : "?" });
  } catch (e) {
    if (isKinoError(e)) throw e;
    throw kino.error("unavailable", "Xuper no est\xE1 disponible ahora");
  }
}
async function validateSettings(values) {
  await null;
  try {
    return await traced(kino, clock, "validateSettings", () => settings().validateSettings(values));
  } catch (e) {
    if (isKinoError(e)) throw e;
    throw kino.error("unavailable", "Xuper no est\xE1 disponible ahora");
  }
}
globalThis.__tv = {
  action,
  browse,
  categories,
  episodes,
  home,
  liveCategories,
  liveChannels,
  liveSearch,
  migrate,
  resolve,
  search,
  section,
  settingsStatus,
  sign,
  validateSettings
};


var __XUPER_STOPWORDS = {
  "el": true, "la": true, "los": true, "las": true, "un": true, "una": true,
  "unos": true, "unas": true, "de": true, "del": true, "y": true, "o": true,
  "the": true, "a": true, "an": true, "of": true, "and": true, "to": true,
  "in": true, "on": true, "for": true
};

function __xuperNormalize(value) {
  return String(value == null ? "" : value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function __xuperTokens(value) {
  return __xuperNormalize(value).split(" ").filter(function (token) {
    return token && !__XUPER_STOPWORDS[token];
  });
}

function __xuperSimilarity(left, right) {
  var a = __xuperTokens(left);
  var b = __xuperTokens(right);
  if (!a.length || !b.length) return 0;
  if (a.join(" ") === b.join(" ")) return 1;
  var seen = {};
  for (var i = 0; i < b.length; i++) seen[b[i]] = true;
  var overlap = 0;
  for (var j = 0; j < a.length; j++) if (seen[a[j]]) overlap++;
  var union = a.length + b.length - overlap;
  return union > 0 ? overlap / union : 0;
}

function __xuperYear(value) {
  var match = String(value == null ? "" : value).match(/(?:19|20)\d{2}/);
  return match ? Number(match[0]) : 0;
}

async function __xuperTitle(tmdbId, mediaType) {
  var type = mediaType === "tv" ? "tv" : "movie";
  var id = String(tmdbId == null ? "" : tmdbId).trim();
  var result = { title: "", originalTitle: "", tmdbId: Number(id) || 0, type: type, year: 0 };
  try {
    if (/^tt\d+$/i.test(id)) {
      var found = await kino.tmdb("/find/" + encodeURIComponent(id), { external_source: "imdb_id", language: "es-MX" });
      var list = type === "tv" ? (found.tv_results || []) : (found.movie_results || []);
      if (!list.length) return result;
      id = String(list[0].id);
      result.tmdbId = Number(id) || 0;
    }
    var data = await kino.tmdb("/" + type + "/" + id, { language: "es-MX" });
    result.title = data.title || data.name || "";
    result.originalTitle = data.original_title || data.original_name || "";
    result.year = __xuperYear(data.release_date || data.first_air_date || "");
    return result;
  } catch (_) {
    return result;
  }
}

async function __xuperGetStreams(tmdbId, mediaType, season, episode) {
  var type = String(mediaType || "").toLowerCase();
  type = type === "tv" || type === "series" ? "tv" : "movie";
  var info = await __xuperTitle(tmdbId, type);
  if (!info.title) return [];
  var query = {
    q: info.title,
    originalTitle: info.originalTitle,
    tmdbId: info.tmdbId,
    type: type
  };
  if (type === "tv") {
    if (season != null) query.season = Number(season);
    if (episode != null) query.episode = Number(episode);
  }
  var found = await globalThis.__tv.search(query);
  var candidates = (Array.isArray(found) ? found : []).filter(function (item) {
    return item && !item.adult;
  }).map(function (item) {
    var score = Math.max(
      __xuperSimilarity(item.title, info.title),
      __xuperSimilarity(item.title, info.originalTitle)
    );
    var itemYear = __xuperYear(item.year);
    if (info.year && itemYear) {
      var yearDiff = Math.abs(info.year - itemYear);
      if (yearDiff === 0) score += 0.1;
      else if (yearDiff <= 1) score += 0.05;
      else if (yearDiff >= 2) score -= 0.2;
    }
    return { item: item, score: score };
  }).filter(function (entry) {
    return entry.score >= 0.7;
  }).sort(function (left, right) {
    return right.score - left.score;
  }).slice(0, 3).map(function (entry) {
    return entry.item;
  });
  if (candidates.length === 0) {
    console.log("xuper picks: sin coincidencias para " + info.title);
    return [];
  }
  console.log("xuper picks: " + candidates.map(function (item) { return item.title; }).join(" | "));
  var picks = candidates;
  var output = [];
  for (var i = 0; i < picks.length; i++) {
    try {
      var resolved = await globalThis.__tv.resolve(picks[i].ref);
      var copies = [resolved].concat(resolved && resolved.alternatives ? resolved.alternatives : []);
      for (var j = 0; j < copies.length; j++) {
        var copy = copies[j];
        if (!copy || !copy.url) continue;
        var label = [picks[i].title, copy.label].filter(Boolean).join(" \u00b7 ");
        output.push({
          title: label,
          name: label,
          url: copy.url,
          provider: "Xuper",
          headers: copy.headers || {}
        });
      }
    } catch (error) {
      console.log("xuper resolve: " + (error && error.message ? error.message : error));
    }
  }
  var seen = {};
  return output.filter(function (item) {
    var key = item.url.replace(/[?&]retry=\d+/, "");
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

module.exports = { getStreams: __xuperGetStreams };
