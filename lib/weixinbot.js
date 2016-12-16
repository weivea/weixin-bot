'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _touch = require('touch');

var _touch2 = _interopRequireDefault(_touch);

var _toughCookie = require('tough-cookie');

var _toughCookie2 = _interopRequireDefault(_toughCookie);

var _nedb = require('nedb');

var _nedb2 = _interopRequireDefault(_nedb);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _qrcodeTerminal = require('qrcode-terminal');

var _qrcodeTerminal2 = _interopRequireDefault(_qrcodeTerminal);

var _toughCookieFilestore = require('tough-cookie-filestore');

var _toughCookieFilestore2 = _interopRequireDefault(_toughCookieFilestore);

var _nodeAxiosCookiejar = require('node-axios-cookiejar');

var _nodeAxiosCookiejar2 = _interopRequireDefault(_nodeAxiosCookiejar);

var _conf = require('./conf');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_nedb2.default.prototype); /* eslint-disable quote-props,no-constant-condition,
                                                             prefer-template,consistent-return,new-cap,no-param-reassign */

var debug,debug1 = (0, _debug2.default)('weixinbot');

var URLS = (0, _conf.getUrls)({});
var logo = _fs2.default.readFileSync(_path2.default.join(__dirname, '..', 'logo.txt'), 'utf8');

// try persistent cookie
var cookiePath = _path2.default.join(process.cwd(), '.cookie.json');
_touch2.default.sync(cookiePath);
var jar = new _toughCookie2.default.CookieJar(new _toughCookieFilestore2.default(cookiePath));

var req = _axios2.default.create({
  timeout: 35e3,
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) ' + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2652.0 Safari/537.36',
    'Referer': 'https://wx2.qq.com/'
  },
  jar: jar,
  withCredentials: true,
  xsrfCookieName: null,
  xsrfHeaderName: null,
  httpAgent: new _http2.default.Agent({ keepAlive: true }),
  httpsAgent: new _https2.default.Agent({ keepAlive: true })
});

(0, _nodeAxiosCookiejar2.default)(req);

var secretPath = _path2.default.join(process.cwd(), '.secret.json');
var makeDeviceID = function makeDeviceID() {
  return 'e' + Math.random().toFixed(15).toString().substring(2, 17);
};

var WeixinBot = function (_EventEmitter) {
  (0, _inherits3.default)(WeixinBot, _EventEmitter);

  function WeixinBot() {


    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, WeixinBot);

    // transporter for send qrcode image url
    // 请不要依赖这个默认提供的邮件账户！。
    var _this = (0, _possibleConstructorReturn3.default)(this, (WeixinBot.__proto__ || (0, _getPrototypeOf2.default)(WeixinBot)).call(this));

    debug = function () {
      debug1(...arguments);
      _this.emit('debug', arguments);
    }
    _this.transporter = _nodemailer2.default.createTransport(options.mailOpts || {
      service: 'QQex',
      auth: {
        user: 'weixinbot@javascript.work',
        pass: 'V0an1KqPdz4ZKNuP'
      }
    });

    // email address for get qrcode image url
    _this.receiver = options.receiver || '';

    (0, _assign2.default)(_this, _conf.CODES);

    debug(logo);
    return _this;
  }

  (0, _createClass3.default)(WeixinBot, [{
    key: 'run',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var secret;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_fs2.default.existsSync(secretPath)) {
                  this.initConfig();
                  secret = JSON.parse(_fs2.default.readFileSync(secretPath, 'utf8'));

                  (0, _assign2.default)(this, secret);
                  this.runLoop();
                } else {
                  this.init();
                }

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function run() {
        return _ref.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: 'initConfig',
    value: function initConfig() {
      this.baseHost = '';
      this.pushHost = '';
      this.uuid = '';
      this.redirectUri = '';
      this.skey = '';
      this.sid = '';
      this.uin = '';
      this.passTicket = '';
      this.baseRequest = null;
      this.my = null;
      this.syncKey = null;
      this.formateSyncKey = '';
      this.deviceid = makeDeviceID();

      // member store
      this.Members = new _nedb2.default();
      this.Contacts = new _nedb2.default();
      this.Groups = new _nedb2.default();
      this.GroupMembers = new _nedb2.default();
      this.Brands = new _nedb2.default(); // 公众帐号
      this.SPs = new _nedb2.default(); // 特殊帐号

      // indexing
      this.Members.ensureIndex({ fieldName: 'UserName', unique: true });
      this.Contacts.ensureIndex({ fieldName: 'UserName', unique: true });
      this.Groups.ensureIndex({ fieldName: 'UserName', unique: true });
      this.Brands.ensureIndex({ fieldName: 'UserName', unique: true });
      this.SPs.ensureIndex({ fieldName: 'UserName', unique: true });

      clearTimeout(this.checkSyncTimer);
      clearInterval(this.updataContactTimer);
    }
  }, {
    key: 'init',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var _this2 = this;

        var qrcodeUrl, loginCode;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                debug('开始登录...');

                this.initConfig();
                _context2.prev = 2;
                _context2.next = 5;
                return this.fetchUUID();

              case 5:
                this.uuid = _context2.sent;
                _context2.next = 13;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2['catch'](2);

                debug('fetch uuid error', _context2.t0);
                this.init();
                return _context2.abrupt('return');

              case 13:
                if (this.uuid) {
                  _context2.next = 17;
                  break;
                }

                debug('获取 uuid 失败，正在重试...');
                this.init();
                return _context2.abrupt('return');

              case 17:

                debug('\u83B7\u5F97 uuid -> ' + this.uuid);

                qrcodeUrl = URLS.QRCODE_PATH + this.uuid;

                debug("登录二维码链接:"+qrcodeUrl);
                this.emit('qrcode', qrcodeUrl);

                if (this.receiver) {
                  debug('\u53D1\u9001\u4E8C\u7EF4\u7801\u56FE\u7247\u5230\u90AE\u7BB1 ' + this.receiver);
                  this.transporter.sendMail({
                    from: 'WeixinBot <' + this.transporter.transporter.options.auth.user + '>',
                    to: this.receiver,
                    subject: 'WeixinBot 请求登录',
                    html: '<img src="' + qrcodeUrl + '" height="256" width="256" />'
                  }, function (e) {
                    if (e) debug('\u53D1\u9001\u4E8C\u7EF4\u7801\u56FE\u7247\u5230\u90AE\u7BB1 ' + _this2.receiver + ' \u5931\u8D25', e);
                  });
                } else {
                  _qrcodeTerminal2.default.generate(qrcodeUrl.replace('/qrcode/', '/l/'));
                }

                // limit check times
                this.checkTimes = 0;

              case 22:
                if (!true) {
                  _context2.next = 35;
                  break;
                }

                _context2.next = 25;
                return this.checkLoginStep();

              case 25:
                loginCode = _context2.sent;

                if (!(loginCode === 200)) {
                  _context2.next = 28;
                  break;
                }

                return _context2.abrupt('break', 35);

              case 28:

                if (loginCode !== 201) this.checkTimes += 1;

                if (!(this.checkTimes > 6)) {
                  _context2.next = 33;
                  break;
                }

                debug('检查登录状态次数超出限制，重新获取二维码');
                this.init();
                return _context2.abrupt('return');

              case 33:
                _context2.next = 22;
                break;

              case 35:
                _context2.prev = 35;

                debug('正在获取凭据...');
                _context2.next = 39;
                return this.fetchTickets();

              case 39:
                debug('获取凭据成功!');
                _context2.next = 47;
                break;

              case 42:
                _context2.prev = 42;
                _context2.t1 = _context2['catch'](35);

                debug('鉴权失败，正在重新登录...', _context2.t1);
                this.init();
                return _context2.abrupt('return');

              case 47:

                debug('开始循环拉取新消息');
                this.runLoop();

              case 49:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 8], [35, 42]]);
      }));

      function init() {
        return _ref2.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'runLoop',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var _this3 = this;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                debug('正在初始化参数...');
                _context3.prev = 1;
                _context3.next = 4;
                return this.webwxinit();

              case 4:
                _context3.next = 11;
                break;

              case 6:
                _context3.prev = 6;
                _context3.t0 = _context3['catch'](1);

                debug('登录信息已失效，正在重新获取二维码...');
                this.init();
                return _context3.abrupt('return');

              case 11:

                debug('初始化成功!');

                _context3.prev = 12;

                debug('正在通知客户端网页端已登录...');
                _context3.next = 16;
                return this.notifyMobile();

              case 16:

                debug('正在获取通讯录列表...');
                _context3.next = 19;
                return this.fetchContact();

              case 19:
                _context3.next = 25;
                break;

              case 21:
                _context3.prev = 21;
                _context3.t1 = _context3['catch'](12);

                debug('初始化信息失败，正在重试');
                this.runLoop();

              case 25:

                debug('通知成功!');
                debug('__login_success__');

                debug('获取通讯录列表成功!');

                // await this.fetchBatchgetContact();
                _context3.next = 29;
                return this.lookupSyncCheckHost();

              case 29:
                this.pushHost = _context3.sent;


                URLS = (0, _conf.getUrls)({ baseHost: this.baseHost, pushHost: this.pushHost });

                this.syncCheck();

                // auto update Contacts every ten minute
                this.updataContactTimer = setInterval(function () {
                  _this3.updateContact();
                }, 1000 * 60 * 10);

              case 33:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 6], [12, 21]]);
      }));

      function runLoop() {
        return _ref3.apply(this, arguments);
      }

      return runLoop;
    }()
  }, {
    key: 'fetchUUID',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        var result, _result, data, uuid;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                result = void 0;
                _context4.prev = 1;
                _context4.next = 4;
                return req.get(URLS.API_jsLogin, {
                  params: {
                    appid: 'wx782c26e4c19acffb',
                    fun: 'new',
                    lang: 'zh_CN',
                    _: +new Date()
                  }
                });

              case 4:
                result = _context4.sent;
                _context4.next = 13;
                break;

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4['catch'](1);

                debug('fetch uuid network error', _context4.t0);
                // network error retry
                _context4.next = 12;
                return this.fetchUUID();

              case 12:
                return _context4.abrupt('return', _context4.sent);

              case 13:
                _result = result;
                data = _result.data;

                if (/uuid = "(.+)";$/.test(data)) {
                  _context4.next = 17;
                  break;
                }

                throw new Error('get uuid failed');

              case 17:
                uuid = data.match(/uuid = "(.+)";$/)[1];
                return _context4.abrupt('return', uuid);

              case 19:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 7]]);
      }));

      function fetchUUID() {
        return _ref4.apply(this, arguments);
      }

      return fetchUUID;
    }()
  }, {
    key: 'checkLoginStep',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
        var result, _result2, data, loginCode;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                result = void 0;
                _context5.prev = 1;
                _context5.next = 4;
                return req.get(URLS.API_login, {
                  params: {
                    tip: 1,
                    uuid: this.uuid,
                    _: +new Date()
                  }
                });

              case 4:
                result = _context5.sent;
                _context5.next = 13;
                break;

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5['catch'](1);

                debug('checkLoginStep network error', _context5.t0);
                _context5.next = 12;
                return this.checkLoginStep();

              case 12:
                return _context5.abrupt('return');

              case 13:
                _result2 = result;
                data = _result2.data;

                if (/code=(\d{3});/.test(data)) {
                  _context5.next = 19;
                  break;
                }

                _context5.next = 18;
                return this.checkLoginStep();

              case 18:
                return _context5.abrupt('return', _context5.sent);

              case 19:
                loginCode = parseInt(data.match(/code=(\d{3});/)[1], 10);
                _context5.t1 = loginCode;
                _context5.next = _context5.t1 === 200 ? 23 : _context5.t1 === 201 ? 28 : _context5.t1 === 408 ? 30 : 32;
                break;

              case 23:
                debug('已点击确认登录!');
                this.redirectUri = data.match(/redirect_uri="(.+)";$/)[1] + '&fun=new';
                this.baseHost = _url2.default.parse(this.redirectUri).host;
                URLS = (0, _conf.getUrls)({ baseHost: this.baseHost });
                return _context5.abrupt('break', 33);

              case 28:
                debug('二维码已被扫描，请确认登录!');
                return _context5.abrupt('break', 33);

              case 30:
                debug('检查登录超时，正在重试...');
                return _context5.abrupt('break', 33);

              case 32:
                debug('未知的状态，重试...');

              case 33:
                return _context5.abrupt('return', loginCode);

              case 34:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 7]]);
      }));

      function checkLoginStep() {
        return _ref5.apply(this, arguments);
      }

      return checkLoginStep;
    }()
  }, {
    key: 'fetchTickets',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
        var result, _result3, data, skeyM, wxsidM, wxuinM, passTicketM;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                result = void 0;
                _context6.prev = 1;
                _context6.next = 4;
                return req.get(this.redirectUri);

              case 4:
                result = _context6.sent;
                _context6.next = 13;
                break;

              case 7:
                _context6.prev = 7;
                _context6.t0 = _context6['catch'](1);

                debug('fetch tickets network error', _context6.t0);
                // network error, retry
                _context6.next = 12;
                return this.fetchTickets();

              case 12:
                return _context6.abrupt('return');

              case 13:
                _result3 = result;
                data = _result3.data;

                if (/<ret>0<\/ret>/.test(data)) {
                  _context6.next = 17;
                  break;
                }

                throw new Error('Get skey failed, restart login');

              case 17:

                // const retM = data.match(/<ret>(.*)<\/ret>/);
                // const scriptM = data.match(/<script>(.*)<\/script>/);
                skeyM = data.match(/<skey>(.*)<\/skey>/);
                wxsidM = data.match(/<wxsid>(.*)<\/wxsid>/);
                wxuinM = data.match(/<wxuin>(.*)<\/wxuin>/);
                passTicketM = data.match(/<pass_ticket>(.*)<\/pass_ticket>/);
                // const redirectUrl = data.match(/<redirect_url>(.*)<\/redirect_url>/);

                this.skey = skeyM && skeyM[1];
                this.sid = wxsidM && wxsidM[1];
                this.uin = wxuinM && wxuinM[1];
                this.passTicket = passTicketM && passTicketM[1];
                debug('\n      \u83B7\u5F97 skey -> ' + this.skey + '\n      \u83B7\u5F97 sid -> ' + this.sid + '\n      \u83B7\u5F97 uid -> ' + this.uin + '\n      \u83B7\u5F97 pass_ticket -> ' + this.passTicket + '\n    ');

                this.baseRequest = {
                  Uin: parseInt(this.uin, 10),
                  Sid: this.sid,
                  Skey: this.skey,
                  DeviceID: this.deviceid
                };

                _fs2.default.writeFileSync(secretPath, (0, _stringify2.default)({
                  skey: this.skey,
                  sid: this.sid,
                  uin: this.uin,
                  passTicket: this.passTicket,
                  baseHost: this.baseHost,
                  baseRequest: this.baseRequest
                }), 'utf8');

              case 28:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[1, 7]]);
      }));

      function fetchTickets() {
        return _ref6.apply(this, arguments);
      }

      return fetchTickets;
    }()
  }, {
    key: 'webwxinit',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
        var result, _result4, data;

        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                result = void 0;
                _context7.prev = 1;
                _context7.next = 4;
                return req.post(URLS.API_webwxinit, { BaseRequest: this.baseRequest }, {
                  params: {
                    pass_ticket: this.passTicket,
                    skey: this.skey
                  }
                });

              case 4:
                result = _context7.sent;
                _context7.next = 13;
                break;

              case 7:
                _context7.prev = 7;
                _context7.t0 = _context7['catch'](1);

                debug('webwxinit network error', _context7.t0);
                // network error retry
                _context7.next = 12;
                return this.webwxinit();

              case 12:
                return _context7.abrupt('return');

              case 13:
                _result4 = result;
                data = _result4.data;

                if (!(!data || !data.BaseResponse || data.BaseResponse.Ret !== 0)) {
                  _context7.next = 17;
                  break;
                }

                throw new Error('Init Webwx failed');

              case 17:

                this.my = data.User;
                this.syncKey = data.SyncKey;
                this.formateSyncKey = this.syncKey.List.map(function (item) {
                  return item.Key + '_' + item.Val;
                }).join('|');

              case 20:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[1, 7]]);
      }));

      function webwxinit() {
        return _ref7.apply(this, arguments);
      }

      return webwxinit;
    }()
  }, {
    key: 'webwxsync',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
        var _this4 = this;

        var result, _result5, data;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                result = void 0;
                _context8.prev = 1;
                _context8.next = 4;
                return req.post(URLS.API_webwxsync, {
                  BaseRequest: this.baseRequest,
                  SyncKey: this.syncKey,
                  rr: ~new Date()
                }, {
                  params: {
                    sid: this.sid,
                    skey: this.skey,
                    pass_ticket: this.passTicket
                  }
                });

              case 4:
                result = _context8.sent;
                _context8.next = 13;
                break;

              case 7:
                _context8.prev = 7;
                _context8.t0 = _context8['catch'](1);

                debug('webwxsync network error', _context8.t0);
                // network error retry
                _context8.next = 12;
                return this.webwxsync();

              case 12:
                return _context8.abrupt('return');

              case 13:
                _result5 = result;
                data = _result5.data;


                this.syncKey = data.SyncKey;
                this.formateSyncKey = this.syncKey.List.map(function (item) {
                  return item.Key + '_' + item.Val;
                }).join('|');

                data.AddMsgList.forEach(function (msg) {
                  return _this4.handleMsg(msg);
                });

              case 18:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this, [[1, 7]]);
      }));

      function webwxsync() {
        return _ref8.apply(this, arguments);
      }

      return webwxsync;
    }()
  }, {
    key: 'lookupSyncCheckHost',
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, host, result, _result6, data, retcode;

        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context9.prev = 3;
                _iterator = (0, _getIterator3.default)(_conf.PUSH_HOST_LIST);

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context9.next = 26;
                  break;
                }

                host = _step.value;
                result = void 0;
                _context9.prev = 8;
                _context9.next = 11;
                return req.get('https://' + host + '/cgi-bin/mmwebwx-bin/synccheck', {
                  params: {
                    r: +new Date(),
                    skey: this.skey,
                    sid: this.sid,
                    uin: this.uin,
                    deviceid: this.deviceid,
                    synckey: this.formateSyncKey,
                    _: +new Date()
                  }
                });

              case 11:
                result = _context9.sent;
                _context9.next = 18;
                break;

              case 14:
                _context9.prev = 14;
                _context9.t0 = _context9['catch'](8);

                debug('lookupSyncCheckHost network error', host);
                // network error retry
                return _context9.abrupt('break', 26);

              case 18:
                _result6 = result;
                data = _result6.data;
                retcode = data.match(/retcode:"(\d+)"/)[1];

                if (!(retcode === '0')) {
                  _context9.next = 23;
                  break;
                }

                return _context9.abrupt('return', host);

              case 23:
                _iteratorNormalCompletion = true;
                _context9.next = 5;
                break;

              case 26:
                _context9.next = 32;
                break;

              case 28:
                _context9.prev = 28;
                _context9.t1 = _context9['catch'](3);
                _didIteratorError = true;
                _iteratorError = _context9.t1;

              case 32:
                _context9.prev = 32;
                _context9.prev = 33;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 35:
                _context9.prev = 35;

                if (!_didIteratorError) {
                  _context9.next = 38;
                  break;
                }

                throw _iteratorError;

              case 38:
                return _context9.finish(35);

              case 39:
                return _context9.finish(32);

              case 40:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this, [[3, 28, 32, 40], [8, 14], [33,, 35, 39]]);
      }));

      function lookupSyncCheckHost() {
        return _ref9.apply(this, arguments);
      }

      return lookupSyncCheckHost;
    }()
  }, {
    key: 'syncCheck',
    value: function () {
      var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10() {
        var _this5 = this;

        var result, _result7, data, retcode, selector;

        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                result = void 0;
                _context10.prev = 1;
                _context10.next = 4;
                return req.get(URLS.API_synccheck, {
                  params: {
                    r: +new Date(),
                    skey: this.skey,
                    sid: this.sid,
                    uin: this.uin,
                    deviceid: this.deviceid,
                    synckey: this.syncKey,
                    _: +new Date()
                  }
                });

              case 4:
                result = _context10.sent;
                _context10.next = 13;
                break;

              case 7:
                _context10.prev = 7;
                _context10.t0 = _context10['catch'](1);

                debug('synccheck network error', _context10.t0);
                // network error retry
                _context10.next = 12;
                return this.syncCheck();

              case 12:
                return _context10.abrupt('return', _context10.sent);

              case 13:
                _result7 = result;
                data = _result7.data;
                retcode = data.match(/retcode:"(\d+)"/)[1];
                selector = data.match(/selector:"(\d+)"/)[1];

                if (!(retcode !== '0')) {
                  _context10.next = 21;
                  break;
                }

                debug('你在其他地方登录或登出了微信，正在尝试重新登录...');
                this.runLoop();
                return _context10.abrupt('return');

              case 21:

                if (selector !== '0') {
                  this.webwxsync();
                }

                clearTimeout(this.checkSyncTimer);
                this.checkSyncTimer = setTimeout(function () {
                  _this5.syncCheck();
                }, 3e3);

              case 24:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this, [[1, 7]]);
      }));

      function syncCheck() {
        return _ref10.apply(this, arguments);
      }

      return syncCheck;
    }()
  }, {
    key: 'notifyMobile',
    value: function () {
      var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11() {
        var result, _result8, data;

        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                result = void 0;
                _context11.prev = 1;
                _context11.next = 4;
                return req.post(URLS.API_webwxstatusnotify, {
                  BaseRequest: this.baseRequest,
                  Code: _conf.CODES.StatusNotifyCode_INITED,
                  FromUserName: this.my.UserName,
                  ToUserName: this.my.UserName,
                  ClientMsgId: +new Date()
                }, {
                  params: {
                    lang: 'zh_CN',
                    pass_ticket: this.passTicket
                  }
                });

              case 4:
                result = _context11.sent;
                _context11.next = 13;
                break;

              case 7:
                _context11.prev = 7;
                _context11.t0 = _context11['catch'](1);

                debug('notify mobile network error', _context11.t0);
                // network error retry
                _context11.next = 12;
                return this.notifyMobile();

              case 12:
                return _context11.abrupt('return');

              case 13:
                _result8 = result;
                data = _result8.data;

                if (!(!data || !data.BaseResponse || data.BaseResponse.Ret !== 0)) {
                  _context11.next = 17;
                  break;
                }

                throw new Error('通知客户端失败');

              case 17:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this, [[1, 7]]);
      }));

      function notifyMobile() {
        return _ref11.apply(this, arguments);
      }

      return notifyMobile;
    }()
  }, {
    key: 'fetchContact',
    value: function () {
      var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12() {
        var _this6 = this;

        var result, _result9, data;

        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                result = void 0;
                _context12.prev = 1;
                _context12.next = 4;
                return req.post(URLS.API_webwxgetcontact, {}, {
                  params: {
                    pass_ticket: this.passTicket,
                    skey: this.skey,
                    r: +new Date()
                  }
                });

              case 4:
                result = _context12.sent;
                _context12.next = 13;
                break;

              case 7:
                _context12.prev = 7;
                _context12.t0 = _context12['catch'](1);

                debug('fetch contact network error', _context12.t0);
                // network error retry
                _context12.next = 12;
                return this.fetchContact();

              case 12:
                return _context12.abrupt('return');

              case 13:
                _result9 = result;
                data = _result9.data;

                if (!(!data || !data.BaseResponse || data.BaseResponse.Ret !== 0)) {
                  _context12.next = 17;
                  break;
                }

                throw new Error('获取通讯录失败');

              case 17:

                this.Members.insert(data.MemberList);
                this.totalMemberCount = data.MemberList.length;
                this.brandCount = 0;
                this.spCount = 0;
                this.groupCount = 0;
                this.friendCount = 0;
                data.MemberList.forEach(function (member) {
                  var userName = member.UserName;

                  if (member.VerifyFlag & _conf.CODES.MM_USERATTRVERIFYFALG_BIZ_BRAND) {
                    _this6.brandCount += 1;
                    _this6.Brands.insert(member);
                    return;
                  }

                  if (_conf.SP_ACCOUNTS.includes(userName) || /@qqim$/.test(userName)) {
                    _this6.spCount += 1;
                    _this6.SPs.insert(member);
                    return;
                  }

                  if (userName.includes('@@')) {
                    _this6.groupCount += 1;
                    _this6.Groups.insert(member);
                    return;
                  }

                  if (userName !== _this6.my.UserName) {
                    _this6.friendCount += 1;
                    _this6.Contacts.insert(member);
                  }
                });

                debug('\n      \u83B7\u53D6\u901A\u8BAF\u5F55\u6210\u529F\n      \u5168\u90E8\u6210\u5458\u6570: ' + this.totalMemberCount + '\n      \u516C\u4F17\u5E10\u53F7\u6570: ' + this.brandCount + '\n      \u7279\u6B8A\u5E10\u53F7\u6570: ' + this.spCount + '\n      \u901A\u8BAF\u5F55\u597D\u53CB\u6570: ' + this.friendCount + '\n      \u52A0\u5165\u7684\u7FA4\u804A\u6570(\u4E0D\u51C6\u786E\uFF0C\u53EA\u6709\u628A\u7FA4\u804A\u52A0\u5165\u901A\u8BAF\u5F55\u624D\u4F1A\u5728\u8FD9\u91CC\u663E\u793A): ' + this.groupCount + '\n    ');

              case 25:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this, [[1, 7]]);
      }));

      function fetchContact() {
        return _ref12.apply(this, arguments);
      }

      return fetchContact;
    }()
  }, {
    key: 'fetchBatchgetContact',
    value: function () {
      var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(groupIds) {
        var _this7 = this;

        var list, result, _result10, data;

        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                list = groupIds.map(function (id) {
                  return { UserName: id, EncryChatRoomId: '' };
                });
                result = void 0;
                _context13.prev = 2;
                _context13.next = 5;
                return req.post(URLS.API_webwxbatchgetcontact, {
                  BaseRequest: this.baseRequest,
                  Count: list.length,
                  List: list
                }, {
                  params: {
                    type: 'ex',
                    r: +new Date()
                  }
                });

              case 5:
                result = _context13.sent;
                _context13.next = 14;
                break;

              case 8:
                _context13.prev = 8;
                _context13.t0 = _context13['catch'](2);

                debug('fetch batchgetcontact network error', _context13.t0);
                // network error retry
                _context13.next = 13;
                return this.fetchBatchgetContact(groupIds);

              case 13:
                return _context13.abrupt('return');

              case 14:
                _result10 = result;
                data = _result10.data;

                if (!(!data || !data.BaseResponse || data.BaseResponse.Ret !== 0)) {
                  _context13.next = 18;
                  break;
                }

                throw new Error('Fetch batchgetcontact fail');

              case 18:

                data.ContactList.forEach(function (Group) {
                  _this7.Groups.insert(Group);
                  debug('\u83B7\u53D6\u5230\u7FA4: ' + Group.NickName);
                  debug('\u7FA4 ' + Group.NickName + ' \u6210\u5458\u6570\u91CF: ' + Group.MemberList.length);

                  var MemberList = Group.MemberList;

                  MemberList.forEach(function (member) {
                    member.GroupUserName = Group.UserName;
                    _this7.GroupMembers.update({
                      UserName: member.UserName,
                      GroupUserName: member.GroupUserName
                    }, member, { upsert: true });
                  });
                });

              case 19:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this, [[2, 8]]);
      }));

      function fetchBatchgetContact(_x2) {
        return _ref13.apply(this, arguments);
      }

      return fetchBatchgetContact;
    }()
  }, {
    key: 'updateContact',
    value: function () {
      var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14() {
        var groups, groupIds;
        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                debug('正在更新通讯录');
                _context14.prev = 1;
                _context14.next = 4;
                return this.fetchContact();

              case 4:
                _context14.next = 6;
                return this.Groups.findAsync({});

              case 6:
                groups = _context14.sent;
                groupIds = groups.map(function (group) {
                  return group.UserName;
                });
                _context14.next = 10;
                return this.fetchBatchgetContact(groupIds);

              case 10:
                _context14.next = 15;
                break;

              case 12:
                _context14.prev = 12;
                _context14.t0 = _context14['catch'](1);

                debug('更新通讯录失败', _context14.t0);

              case 15:
                debug('更新通讯录成功!');

              case 16:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this, [[1, 12]]);
      }));

      function updateContact() {
        return _ref14.apply(this, arguments);
      }

      return updateContact;
    }()
  }, {
    key: 'getMember',
    value: function () {
      var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(id) {
        var member;
        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.Members.findOneAsync({ UserName: id });

              case 2:
                member = _context15.sent;
                return _context15.abrupt('return', member);

              case 4:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function getMember(_x3) {
        return _ref15.apply(this, arguments);
      }

      return getMember;
    }()
  }, {
    key: 'getGroup',
    value: function () {
      var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(groupId) {
        var group;
        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return this.Groups.findOneAsync({ UserName: groupId });

              case 2:
                group = _context16.sent;

                if (!group) {
                  _context16.next = 5;
                  break;
                }

                return _context16.abrupt('return', group);

              case 5:
                _context16.prev = 5;
                _context16.next = 8;
                return this.fetchBatchgetContact([groupId]);

              case 8:
                _context16.next = 14;
                break;

              case 10:
                _context16.prev = 10;
                _context16.t0 = _context16['catch'](5);

                debug('fetchBatchgetContact error', _context16.t0);
                return _context16.abrupt('return', null);

              case 14:
                _context16.next = 16;
                return this.Groups.findOneAsync({ UserName: groupId });

              case 16:
                group = _context16.sent;
                return _context16.abrupt('return', group);

              case 18:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this, [[5, 10]]);
      }));

      function getGroup(_x4) {
        return _ref16.apply(this, arguments);
      }

      return getGroup;
    }()
  }, {
    key: 'getGroupMember',
    value: function () {
      var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(id, groupId) {
        var member;
        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return this.GroupMembers.findOneAsync({
                  UserName: id,
                  GroupUserName: groupId
                });

              case 2:
                member = _context17.sent;

                if (!member) {
                  _context17.next = 5;
                  break;
                }

                return _context17.abrupt('return', member);

              case 5:
                _context17.prev = 5;
                _context17.next = 8;
                return this.fetchBatchgetContact([groupId]);

              case 8:
                _context17.next = 14;
                break;

              case 10:
                _context17.prev = 10;
                _context17.t0 = _context17['catch'](5);

                debug('fetchBatchgetContact error', _context17.t0);
                return _context17.abrupt('return', null);

              case 14:
                _context17.next = 16;
                return this.GroupMembers.findOneAsync({ UserName: id });

              case 16:
                member = _context17.sent;
                return _context17.abrupt('return', member);

              case 18:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this, [[5, 10]]);
      }));

      function getGroupMember(_x5, _x6) {
        return _ref17.apply(this, arguments);
      }

      return getGroupMember;
    }()
  }, {
    key: 'handleMsg',
    value: function () {
      var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(msg) {
        var userId;
        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                if (!msg.FromUserName.includes('@@')) {
                  _context18.next = 12;
                  break;
                }

                userId = msg.Content.match(/^(@[a-zA-Z0-9]+|[a-zA-Z0-9_-]+):<br\/>/)[1];
                _context18.next = 4;
                return this.getGroupMember(userId, msg.FromUserName);

              case 4:
                msg.GroupMember = _context18.sent;
                _context18.next = 7;
                return this.getGroup(msg.FromUserName);

              case 7:
                msg.Group = _context18.sent;

                msg.Content = msg.Content.replace(/^(@[a-zA-Z0-9]+|[a-zA-Z0-9_-]+):<br\/>/, '');

                debug('\n        \u6765\u81EA\u7FA4 ' + msg.Group.NickName + ' \u7684\u6D88\u606F\n        ' + (msg.GroupMember.DisplayName || msg.GroupMember.NickName) + ': ' + msg.Content + '\n      ');

                this.emit('group', msg);
                return _context18.abrupt('return');

              case 12:
                _context18.next = 14;
                return this.getMember(msg.FromUserName);

              case 14:
                msg.Member = _context18.sent;

                if (msg.Member) {
                  _context18.next = 17;
                  break;
                }

                return _context18.abrupt('return');

              case 17:
                debug('\n      \u65B0\u6D88\u606F\n      ' + (msg.Member.RemarkName || msg.Member.NickName) + ': ' + msg.Content + '\n    ');

                this.emit('friend', msg);
                // if (msg.MsgType === CODES.MSGTYPE_SYSNOTICE) {
                //   return;
                // }

                // switch (msg.MsgType) {
                //   case CODES.MSGTYPE_APP:
                //     break;
                //   case CODES.MSGTYPE_EMOTICON:
                //     break;
                //   case CODES.MSGTYPE_IMAGE:
                //     break;
                //   case CODES.MSGTYPE_VOICE:
                //     break;
                //   case CODES.MSGTYPE_VIDEO:
                //     break;
                //   case CODES.MSGTYPE_MICROVIDEO:
                //     break;
                //   case CODES.MSGTYPE_TEXT:
                //     try {
                //       await this.sendText(msg.FromUserName, msg.Content);
                //     } catch (e) {
                //       console.error(e);
                //     }
                //     break;
                //   case CODES.MSGTYPE_RECALLED:
                //     break;
                //   case CODES.MSGTYPE_LOCATION:
                //     break;
                //   case CODES.MSGTYPE_VOIPMSG:
                //   case CODES.MSGTYPE_VOIPNOTIFY:
                //   case CODES.MSGTYPE_VOIPINVITE:
                //     break;
                //   case CODES.MSGTYPE_POSSIBLEFRIEND_MSG:
                //     break;
                //   case CODES.MSGTYPE_VERIFYMSG:
                //     break;
                //   case CODES.MSGTYPE_SHARECARD:
                //     break;
                //   case CODES.MSGTYPE_SYS:
                //     break;
                //   default:
                // }

              case 19:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function handleMsg(_x7) {
        return _ref18.apply(this, arguments);
      }

      return handleMsg;
    }()
  }, {
    key: 'sendText',
    value: function sendText(to, content, callback) {
      var _this8 = this;

      var clientMsgId = (+new Date() + Math.random().toFixed(3)).replace('.', '');

      req.post(URLS.API_webwxsendmsg, {
        BaseRequest: this.baseRequest,
        Msg: {
          Type: _conf.CODES.MSGTYPE_TEXT,
          Content: content,
          FromUserName: this.my.UserName,
          ToUserName: to,
          LocalID: clientMsgId,
          ClientMsgId: clientMsgId
        }
      }, {
        params: {
          pass_ticket: this.passTicket
        }
      }).then(function (result) {
        var data = result.data;

        callback = callback || function () {
          return null;
        };
        if (!data || !data.BaseResponse || data.BaseResponse.Ret !== 0) {
          return callback(new Error('Send text fail'));
        }

        callback();
      }).catch(function (e) {
        debug('send text network error', e);
        // network error, retry
        _this8.sendText(to, content, callback);
        return;
      });
    }
  }]);
  return WeixinBot;
}(_events2.default);

// compatible nodejs require


module.exports = WeixinBot;