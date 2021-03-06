// Generated by CoffeeScript 1.7.1
(function() {
  var AUTO_SIZE_ATTRIBUTES, ERROR_MSG_ALREADY_NAVIGATED, ERROR_MSG_CANNOT_INJECT_SCRIPT, ERROR_MSG_CONTENTWINDOW_NOT_AVAILABLE, ERROR_MSG_INVALID_PARTITION_ATTRIBUTE, ERROR_MSG_INVALID_PRELOAD_ATTRIBUTE, PLUGIN_METHOD_ATTACH, Partition, WEB_VIEW_ATTRIBUTE_ALLOWTRANSPARENCY, WEB_VIEW_ATTRIBUTE_AUTOSIZE, WEB_VIEW_ATTRIBUTE_MAXHEIGHT, WEB_VIEW_ATTRIBUTE_MAXWIDTH, WEB_VIEW_ATTRIBUTE_MINHEIGHT, WEB_VIEW_ATTRIBUTE_MINWIDTH, WEB_VIEW_ATTRIBUTE_NODEINTEGRATION, WEB_VIEW_ATTRIBUTE_PARTITION, WEB_VIEW_ATTRIBUTE_PLUGINS, WEB_VIEW_ATTRIBUTE_PRELOAD, WebView, getNextId, guestViewInternal, listener, nextId, registerBrowserPluginElement, registerWebViewElement, remote, useCapture, v8Util, webFrame,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  v8Util = process.atomBinding('v8_util');

  guestViewInternal = require('./guest-view-internal');

  webFrame = require('web-frame');

  remote = require('remote');

  nextId = 0;

  getNextId = function() {
    return ++nextId;
  };

  PLUGIN_METHOD_ATTACH = '-internal-attach';

  WEB_VIEW_ATTRIBUTE_ALLOWTRANSPARENCY = 'allowtransparency';

  WEB_VIEW_ATTRIBUTE_AUTOSIZE = 'autosize';

  WEB_VIEW_ATTRIBUTE_MAXHEIGHT = 'maxheight';

  WEB_VIEW_ATTRIBUTE_MAXWIDTH = 'maxwidth';

  WEB_VIEW_ATTRIBUTE_MINHEIGHT = 'minheight';

  WEB_VIEW_ATTRIBUTE_MINWIDTH = 'minwidth';

  WEB_VIEW_ATTRIBUTE_PARTITION = 'partition';

  WEB_VIEW_ATTRIBUTE_NODEINTEGRATION = 'nodeintegration';

  WEB_VIEW_ATTRIBUTE_PLUGINS = 'plugins';

  WEB_VIEW_ATTRIBUTE_PRELOAD = 'preload';

  AUTO_SIZE_ATTRIBUTES = [WEB_VIEW_ATTRIBUTE_AUTOSIZE, WEB_VIEW_ATTRIBUTE_MAXHEIGHT, WEB_VIEW_ATTRIBUTE_MAXWIDTH, WEB_VIEW_ATTRIBUTE_MINHEIGHT, WEB_VIEW_ATTRIBUTE_MINWIDTH];

  ERROR_MSG_ALREADY_NAVIGATED = 'The object has already navigated, so its partition cannot be changed.';

  ERROR_MSG_CANNOT_INJECT_SCRIPT = '<webview>: ' + 'Script cannot be injected into content until the page has loaded.';

  ERROR_MSG_CONTENTWINDOW_NOT_AVAILABLE = '<webview>: ' + 'contentWindow is not available at this time. It will become available ' + 'when the page has finished loading.';

  ERROR_MSG_INVALID_PARTITION_ATTRIBUTE = 'Invalid partition attribute.';

  ERROR_MSG_INVALID_PRELOAD_ATTRIBUTE = 'Only "file:" or "asar:" protocol is supported in "preload" attribute.';

  Partition = (function() {
    function Partition() {
      this.validPartitionId = true;
      this.persistStorage = false;
      this.storagePartitionId = '';
    }

    Partition.prototype.toAttribute = function() {
      if (!this.validPartitionId) {
        return '';
      }
      return (this.persistStorage ? 'persist:' : '') + this.storagePartitionId;
    };

    Partition.prototype.fromAttribute = function(value, hasNavigated) {
      var LEN, result;
      result = {};
      if (hasNavigated) {
        result.error = ERROR_MSG_ALREADY_NAVIGATED;
        return result;
      }
      if (value == null) {
        value = '';
      }
      LEN = 'persist:'.length;
      if (value.substr(0, LEN) === 'persist:') {
        value = value.substr(LEN);
        if (!value) {
          this.validPartitionId = false;
          result.error = ERROR_MSG_INVALID_PARTITION_ATTRIBUTE;
          return result;
        }
        this.persistStorage = true;
      } else {
        this.persistStorage = false;
      }
      this.storagePartitionId = value;
      return result;
    };

    return Partition;

  })();

  WebView = (function() {
    function WebView(webviewNode) {
      var shadowRoot;
      this.webviewNode = webviewNode;
      v8Util.setHiddenValue(this.webviewNode, 'internal', this);
      this.attached = false;
      this.pendingGuestCreation = false;
      this.elementAttached = false;
      this.beforeFirstNavigation = true;
      this.contentWindow = null;
      this.validPartitionId = true;
      this.deferredAttachState = null;
      this.on = {};
      this.browserPluginNode = this.createBrowserPluginNode();
      shadowRoot = this.webviewNode.createShadowRoot();
      this.partition = new Partition();
      this.setupWebViewSrcAttributeMutationObserver();
      this.setupFocusPropagation();
      this.setupWebviewNodeProperties();
      this.viewInstanceId = getNextId();
      guestViewInternal.registerEvents(this, this.viewInstanceId);
      shadowRoot.appendChild(this.browserPluginNode);
    }

    WebView.prototype.createBrowserPluginNode = function() {
      var browserPluginNode;
      browserPluginNode = new WebView.BrowserPlugin();
      v8Util.setHiddenValue(browserPluginNode, 'internal', this);
      return browserPluginNode;
    };

    WebView.prototype.getGuestInstanceId = function() {
      return this.guestInstanceId;
    };

    WebView.prototype.reset = function() {
      if (this.guestInstanceId) {
        guestViewInternal.destroyGuest(this.guestInstanceId);
        this.guestInstanceId = void 0;
        this.beforeFirstNavigation = true;
        this.validPartitionId = true;
        this.partition.validPartitionId = true;
        this.contentWindow = null;
      }
      return this.internalInstanceId = 0;
    };

    WebView.prototype.setRequestPropertyOnWebViewNode = function(request) {
      return Object.defineProperty(this.webviewNode, 'request', {
        value: request,
        enumerable: true
      });
    };

    WebView.prototype.setupFocusPropagation = function() {
      if (!this.webviewNode.hasAttribute('tabIndex')) {
        this.webviewNode.setAttribute('tabIndex', -1);
      }
      this.webviewNode.addEventListener('focus', (function(_this) {
        return function(e) {
          return _this.browserPluginNode.focus();
        };
      })(this));
      return this.webviewNode.addEventListener('blur', (function(_this) {
        return function(e) {
          return _this.browserPluginNode.blur();
        };
      })(this));
    };

    WebView.prototype.validateExecuteCodeCall = function() {
      if (!this.guestInstanceId) {
        throw new Error(ERROR_MSG_CANNOT_INJECT_SCRIPT);
      }
    };

    WebView.prototype.setupAutoSizeProperties = function() {
      var attributeName, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = AUTO_SIZE_ATTRIBUTES.length; _i < _len; _i++) {
        attributeName = AUTO_SIZE_ATTRIBUTES[_i];
        this[attributeName] = this.webviewNode.getAttribute(attributeName);
        _results.push(Object.defineProperty(this.webviewNode, attributeName, {
          get: (function(_this) {
            return function() {
              return _this[attributeName];
            };
          })(this),
          set: (function(_this) {
            return function(value) {
              return _this.webviewNode.setAttribute(attributeName, value);
            };
          })(this),
          enumerable: true
        }));
      }
      return _results;
    };

    WebView.prototype.setupWebviewNodeProperties = function() {
      this.setupAutoSizeProperties();
      Object.defineProperty(this.webviewNode, WEB_VIEW_ATTRIBUTE_ALLOWTRANSPARENCY, {
        get: (function(_this) {
          return function() {
            return _this.allowtransparency;
          };
        })(this),
        set: (function(_this) {
          return function(value) {
            return _this.webviewNode.setAttribute(WEB_VIEW_ATTRIBUTE_ALLOWTRANSPARENCY, value);
          };
        })(this),
        enumerable: true
      });
      Object.defineProperty(this.webviewNode, 'contentWindow', {
        get: (function(_this) {
          return function() {
            if (_this.contentWindow != null) {
              return _this.contentWindow;
            }
            return window.console.error(ERROR_MSG_CONTENTWINDOW_NOT_AVAILABLE);
          };
        })(this),
        enumerable: true
      });
      Object.defineProperty(this.webviewNode, 'partition', {
        get: (function(_this) {
          return function() {
            return _this.partition.toAttribute();
          };
        })(this),
        set: (function(_this) {
          return function(value) {
            var result;
            result = _this.partition.fromAttribute(value, _this.hasNavigated());
            if (result.error != null) {
              throw result.error;
            }
            return _this.webviewNode.setAttribute('partition', value);
          };
        })(this),
        enumerable: true
      });
      this.src = this.webviewNode.getAttribute('src');
      Object.defineProperty(this.webviewNode, 'src', {
        get: (function(_this) {
          return function() {
            return _this.src;
          };
        })(this),
        set: (function(_this) {
          return function(value) {
            return _this.webviewNode.setAttribute('src', value);
          };
        })(this),
        enumerable: true
      });
      this.httpreferrer = this.webviewNode.getAttribute('httpreferrer');
      return Object.defineProperty(this.webviewNode, 'httpreferrer', {
        get: (function(_this) {
          return function() {
            return _this.httpreferrer;
          };
        })(this),
        set: (function(_this) {
          return function(value) {
            return _this.webviewNode.setAttribute('httpreferrer', value);
          };
        })(this),
        enumerable: true
      });
    };

    WebView.prototype.setupWebViewSrcAttributeMutationObserver = function() {
      var params;
      this.srcAndPartitionObserver = new MutationObserver((function(_this) {
        return function(mutations) {
          var mutation, newValue, oldValue, _i, _len;
          for (_i = 0, _len = mutations.length; _i < _len; _i++) {
            mutation = mutations[_i];
            oldValue = mutation.oldValue;
            newValue = _this.webviewNode.getAttribute(mutation.attributeName);
            if (oldValue !== newValue) {
              return;
            }
            _this.handleWebviewAttributeMutation(mutation.attributeName, oldValue, newValue);
          }
        };
      })(this));
      params = {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['src', 'partition', 'httpreferrer']
      };
      return this.srcAndPartitionObserver.observe(this.webviewNode, params);
    };

    WebView.prototype.handleWebviewAttributeMutation = function(name, oldValue, newValue) {
      var autosize, result;
      if (__indexOf.call(AUTO_SIZE_ATTRIBUTES, name) >= 0) {
        this[name] = newValue;
        if (!this.guestInstanceId) {
          return;
        }
        autosize = this.webviewNode.hasAttribute(WEB_VIEW_ATTRIBUTE_AUTOSIZE);
        return guestViewInternal.setAutoSize(this.guestInstanceId, {
          enableAutoSize: autosize,
          min: {
            width: parseInt(this.minwidth || 0),
            height: parseInt(this.minheight || 0)
          },
          max: {
            width: parseInt(this.maxwidth || 0),
            height: parseInt(this.maxheight || 0)
          }
        });
      } else if (name === WEB_VIEW_ATTRIBUTE_ALLOWTRANSPARENCY) {
        if (oldValue == null) {
          oldValue = '';
        }
        if (newValue == null) {
          newValue = '';
        }
        if (oldValue === newValue) {
          return;
        }
        this.allowtransparency = newValue !== '';
        if (!this.guestInstanceId) {
          return;
        }
        return guestViewInternal.setAllowTransparency(this.guestInstanceId, this.allowtransparency);
      } else if (name === 'httpreferrer') {
        if (oldValue == null) {
          oldValue = '';
        }
        if (newValue == null) {
          newValue = '';
        }
        if (newValue === '' && oldValue !== '') {
          this.webviewNode.setAttribute('httpreferrer', oldValue);
        }
        this.httpreferrer = newValue;
        result = {};
        this.parseSrcAttribute(result);
        if (result.error != null) {
          throw result.error;
        }
      } else if (name === 'src') {
        if (oldValue == null) {
          oldValue = '';
        }
        if (newValue == null) {
          newValue = '';
        }
        if (newValue === '' && oldValue !== '') {
          this.ignoreNextSrcAttributeChange = true;
          this.webviewNode.setAttribute('src', oldValue);
        }
        this.src = newValue;
        if (this.ignoreNextSrcAttributeChange) {
          this.srcAndPartitionObserver.takeRecords();
          this.ignoreNextSrcAttributeChange = false;
          return;
        }
        result = {};
        this.parseSrcAttribute(result);
        if (result.error != null) {
          throw result.error;
        }
      } else if (name === 'partition') {
        return this.partition.fromAttribute(newValue, this.hasNavigated());
      }
    };

    WebView.prototype.handleBrowserPluginAttributeMutation = function(name, oldValue, newValue) {
      var isNewWindow, params;
      if (name === 'internalbindings' && !oldValue && !!newValue) {
        this.browserPluginNode.removeAttribute('internalbindings');
        if (!!this.guestInstanceId && this.guestInstanceId !== 0) {
          isNewWindow = this.deferredAttachState ? this.deferredAttachState.isNewWindow : false;
          params = this.buildAttachParams(isNewWindow);
          return this.browserPluginNode[PLUGIN_METHOD_ATTACH](this.guestInstanceId, params);
        }
      }
    };

    WebView.prototype.onSizeChanged = function(webViewEvent) {
      var height, maxHeight, maxWidth, minHeight, minWidth, newHeight, newWidth, node, width;
      newWidth = webViewEvent.newWidth;
      newHeight = webViewEvent.newHeight;
      node = this.webviewNode;
      width = node.offsetWidth;
      height = node.offsetHeight;
      if (node.hasAttribute(WEB_VIEW_ATTRIBUTE_MAXWIDTH) && node[WEB_VIEW_ATTRIBUTE_MAXWIDTH]) {
        maxWidth = node[WEB_VIEW_ATTRIBUTE_MAXWIDTH];
      } else {
        maxWidth = width;
      }
      if (node.hasAttribute(WEB_VIEW_ATTRIBUTE_MINWIDTH) && node[WEB_VIEW_ATTRIBUTE_MINWIDTH]) {
        minWidth = node[WEB_VIEW_ATTRIBUTE_MINWIDTH];
      } else {
        minWidth = width;
      }
      if (minWidth > maxWidth) {
        minWidth = maxWidth;
      }
      if (node.hasAttribute(WEB_VIEW_ATTRIBUTE_MAXHEIGHT) && node[WEB_VIEW_ATTRIBUTE_MAXHEIGHT]) {
        maxHeight = node[WEB_VIEW_ATTRIBUTE_MAXHEIGHT];
      } else {
        maxHeight = height;
      }
      if (node.hasAttribute(WEB_VIEW_ATTRIBUTE_MINHEIGHT) && node[WEB_VIEW_ATTRIBUTE_MINHEIGHT]) {
        minHeight = node[WEB_VIEW_ATTRIBUTE_MINHEIGHT];
      } else {
        minHeight = height;
      }
      if (minHeight > maxHeight) {
        minHeight = maxHeight;
      }
      if (!this.webviewNode.hasAttribute(WEB_VIEW_ATTRIBUTE_AUTOSIZE || (newWidth >= minWidth && newWidth <= maxWidth && newHeight >= minHeight && newHeight <= maxHeight))) {
        node.style.width = newWidth + 'px';
        node.style.height = newHeight + 'px';
        return this.dispatchEvent(webViewEvent);
      }
    };

    WebView.prototype.isPluginInRenderTree = function() {
      return 'function' === typeof this.browserPluginNode[PLUGIN_METHOD_ATTACH];
    };

    WebView.prototype.hasNavigated = function() {
      return !this.beforeFirstNavigation;
    };

    WebView.prototype.parseSrcAttribute = function(result) {
      var urlOptions;
      if (!this.partition.validPartitionId) {
        result.error = ERROR_MSG_INVALID_PARTITION_ATTRIBUTE;
        return;
      }
      this.src = this.webviewNode.getAttribute('src');
      if (!this.src) {
        return;
      }
      if (this.guestInstanceId == null) {
        if (this.beforeFirstNavigation) {
          this.beforeFirstNavigation = false;
          this.createGuest();
        }
        return;
      }
      urlOptions = this.httpreferrer ? {
        httpreferrer: this.httpreferrer
      } : {};
      return remote.getGuestWebContents(this.guestInstanceId).loadUrl(this.src, urlOptions);
    };

    WebView.prototype.parseAttributes = function() {
      var attributeValue, hasNavigated, result;
      if (!this.elementAttached) {
        return;
      }
      hasNavigated = this.hasNavigated();
      attributeValue = this.webviewNode.getAttribute('partition');
      result = this.partition.fromAttribute(attributeValue, hasNavigated);
      return this.parseSrcAttribute(result);
    };

    WebView.prototype.createGuest = function() {
      var a, params, preload, protocol, storagePartitionId;
      if (this.pendingGuestCreation) {
        return;
      }
      storagePartitionId = this.webviewNode.getAttribute(WEB_VIEW_ATTRIBUTE_PARTITION) || this.webviewNode[WEB_VIEW_ATTRIBUTE_PARTITION];
      params = {
        storagePartitionId: storagePartitionId,
        nodeIntegration: this.webviewNode.hasAttribute(WEB_VIEW_ATTRIBUTE_NODEINTEGRATION),
        plugins: this.webviewNode.hasAttribute(WEB_VIEW_ATTRIBUTE_PLUGINS)
      };
      if (this.webviewNode.hasAttribute(WEB_VIEW_ATTRIBUTE_PRELOAD)) {
        preload = this.webviewNode.getAttribute(WEB_VIEW_ATTRIBUTE_PRELOAD);
        a = document.createElement('a');
        a.href = preload;
        params.preload = a.href;
        protocol = params.preload.substr(0, 5);
        if (protocol !== 'file:' && protocol !== 'asar:') {
          delete params.preload;
          console.error(ERROR_MSG_INVALID_PRELOAD_ATTRIBUTE);
        }
      }
      guestViewInternal.createGuest('webview', params, (function(_this) {
        return function(guestInstanceId) {
          _this.pendingGuestCreation = false;
          if (!_this.elementAttached) {
            guestViewInternal.destroyGuest(guestInstanceId);
            return;
          }
          return _this.attachWindow(guestInstanceId, false);
        };
      })(this));
      return this.pendingGuestCreation = true;
    };

    WebView.prototype.dispatchEvent = function(webViewEvent) {
      return this.webviewNode.dispatchEvent(webViewEvent);
    };

    WebView.prototype.setupEventProperty = function(eventName) {
      var propertyName;
      propertyName = 'on' + eventName.toLowerCase();
      return Object.defineProperty(this.webviewNode, propertyName, {
        get: (function(_this) {
          return function() {
            return _this.on[propertyName];
          };
        })(this),
        set: (function(_this) {
          return function(value) {
            if (_this.on[propertyName]) {
              _this.webviewNode.removeEventListener(eventName, _this.on[propertyName]);
            }
            _this.on[propertyName] = value;
            if (value) {
              return _this.webviewNode.addEventListener(eventName, value);
            }
          };
        })(this),
        enumerable: true
      });
    };

    WebView.prototype.onLoadCommit = function(baseUrlForDataUrl, currentEntryIndex, entryCount, processId, url, isTopLevel) {
      var newValue, oldValue;
      this.baseUrlForDataUrl = baseUrlForDataUrl;
      this.currentEntryIndex = currentEntryIndex;
      this.entryCount = entryCount;
      this.processId = processId;
      oldValue = this.webviewNode.getAttribute('src');
      newValue = url;
      if (isTopLevel && (oldValue !== newValue)) {
        this.ignoreNextSrcAttributeChange = true;
        return this.webviewNode.setAttribute('src', newValue);
      }
    };

    WebView.prototype.onAttach = function(storagePartitionId) {
      this.webviewNode.setAttribute('partition', storagePartitionId);
      return this.partition.fromAttribute(storagePartitionId, this.hasNavigated());
    };

    WebView.prototype.buildAttachParams = function(isNewWindow) {
      return {
        allowtransparency: this.allowtransparency || false,
        autosize: this.webviewNode.hasAttribute(WEB_VIEW_ATTRIBUTE_AUTOSIZE),
        instanceId: this.viewInstanceId,
        maxheight: parseInt(this.maxheight || 0),
        maxwidth: parseInt(this.maxwidth || 0),
        minheight: parseInt(this.minheight || 0),
        minwidth: parseInt(this.minwidth || 0),
        src: isNewWindow ? void 0 : this.src,
        storagePartitionId: this.partition.toAttribute(),
        userAgentOverride: this.userAgentOverride,
        httpreferrer: this.httpreferrer
      };
    };

    WebView.prototype.attachWindow = function(guestInstanceId, isNewWindow) {
      var params;
      this.guestInstanceId = guestInstanceId;
      params = this.buildAttachParams(isNewWindow);
      if (!this.isPluginInRenderTree()) {
        this.deferredAttachState = {
          isNewWindow: isNewWindow
        };
        return true;
      }
      this.deferredAttachState = null;
      return this.browserPluginNode[PLUGIN_METHOD_ATTACH](this.guestInstanceId, params);
    };

    return WebView;

  })();

  registerBrowserPluginElement = function() {
    var proto;
    proto = Object.create(HTMLObjectElement.prototype);
    proto.createdCallback = function() {
      this.setAttribute('type', 'application/browser-plugin');
      this.setAttribute('id', 'browser-plugin-' + getNextId());
      this.style.width = '100%';
      return this.style.height = '100%';
    };
    proto.attributeChangedCallback = function(name, oldValue, newValue) {
      var internal;
      internal = v8Util.getHiddenValue(this, 'internal');
      if (!internal) {
        return;
      }
      return internal.handleBrowserPluginAttributeMutation(name, oldValue, newValue);
    };
    proto.attachedCallback = function() {
      var unused;
      return unused = this.nonExistentAttribute;
    };
    WebView.BrowserPlugin = webFrame.registerEmbedderCustomElement('browserplugin', {
      "extends": 'object',
      prototype: proto
    });
    delete proto.createdCallback;
    delete proto.attachedCallback;
    delete proto.detachedCallback;
    return delete proto.attributeChangedCallback;
  };

  registerWebViewElement = function() {
    var createHandler, m, methods, proto, _i, _len;
    proto = Object.create(HTMLObjectElement.prototype);
    proto.createdCallback = function() {
      return new WebView(this);
    };
    proto.attributeChangedCallback = function(name, oldValue, newValue) {
      var internal;
      internal = v8Util.getHiddenValue(this, 'internal');
      if (!internal) {
        return;
      }
      return internal.handleWebviewAttributeMutation(name, oldValue, newValue);
    };
    proto.detachedCallback = function() {
      var internal;
      internal = v8Util.getHiddenValue(this, 'internal');
      if (!internal) {
        return;
      }
      internal.elementAttached = false;
      return internal.reset();
    };
    proto.attachedCallback = function() {
      var internal;
      internal = v8Util.getHiddenValue(this, 'internal');
      if (!internal) {
        return;
      }
      if (!internal.elementAttached) {
        internal.elementAttached = true;
        return internal.parseAttributes();
      }
    };
    methods = ["getUrl", "getTitle", "isLoading", "isWaitingForResponse", "stop", "reload", "reloadIngoringCache", "canGoBack", "canGoForward", "canGoToOffset", "goBack", "goForward", "goToIndex", "goToOffset", "isCrashed", "setUserAgent", "executeJavaScript", "insertCSS", "openDevTools", "closeDevTools", "isDevToolsOpened", "send", "getId"];
    createHandler = function(m) {
      return function() {
        var args, internal, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        internal = v8Util.getHiddenValue(this, 'internal');
        return (_ref = remote.getGuestWebContents(internal.guestInstanceId))[m].apply(_ref, args);
      };
    };
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      m = methods[_i];
      proto[m] = createHandler(m);
    }
    window.WebView = webFrame.registerEmbedderCustomElement('webview', {
      prototype: proto
    });
    delete proto.createdCallback;
    delete proto.attachedCallback;
    delete proto.detachedCallback;
    return delete proto.attributeChangedCallback;
  };

  useCapture = true;

  listener = function(event) {
    if (document.readyState === 'loading') {
      return;
    }
    registerBrowserPluginElement();
    registerWebViewElement();
    return window.removeEventListener(event.type, listener, useCapture);
  };

  window.addEventListener('readystatechange', listener, true);

}).call(this);
