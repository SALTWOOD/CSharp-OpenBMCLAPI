class TTB {  
    constructor() {
        this.VERSION = "0.0.1"
        this.defaultStyles = {
            ".ttb-flex": [
                "display: flex",
                "flex-wrap: wrap"
            ],
            ".ttb-modal": [
                "position: fixed",
                "display: flex",
                "flex-wrap: nowrap",
                "align-items: center",
                "justify-content: center",
                "background: rgba(0, 0, 0, 0.2)",
                "top: 0",
                "left: 0",
                "width: 100vw",
                "height: 100vh",
                "z-index: 999999",
                "opacity: 0",
                "transition: opacity 200ms linear 0s",
            ],
            ".ttb-modal.show": [
                "opacity: 1"
            ],
            ".ttb-notification": [
                "display: flex",
                "flex-wrap: nowrap",
                "flex-direction: column;",
                "justify-content: center;",
                "align-items: flex-start;",
                "transform: translate(100%, -100%)",
                "height: 0",
                "min-height: 0",
                "padding: 0px",
                "margin-bottom: 0px",
                "min-width: 256px",
                "min-height: 64px",
                "box-sizing: border-sizing",
                "border: 1px solid rgba(0, 0, 0, 0.1);",
                "border-radius: 4px",
                "transition: transform 200ms linear 0s, height 200ms linear 0s, min-height 200ms linear 0s, margin-bottom 200ms linear 0s, padding 200ms linear 0s",
            ],
            ".ttb-notification:hover": "cursor: pointer",
            ".ttb-notification.show": [
                "transform: translate(0%, 0%)",
                "min-height: 64px",
                "height: 64px",
                "padding: 16px",
                "margin-bottom: 16px",
            ],
            ".ttb-notifications": [
                "position: fixed",
                "top: 0",
                "left: calc(100vw - 256px)",
                "z-index: 10000000"
            ],
        }
        this.websockets = []
        this.documentStyle = document.createElement("style");
        this.styles = []
        this.set_styles(this.defaultStyles)
        document.head.append(this.documentStyle)
        window.addEventListener('beforeunload', () => {
            this.websockets.forEach(e => e.object.close())
        }); 
        this._flexes = []
        this._modal = new TTBModal()
        this._notifications = new TTBNotificationManager()
        this._response_handlers = {}
        g_TTB = this
    }
    init() {
        this._notifications.init()
    }
    getModal() {
        return this._modal
    }
    addFlex(flex) {
        this._flexes.push(flex)
    }
    resizeFlex(cur) {
        for (const flex of this._flexes) {
            if (cur.base == flex.base) continue
            flex.update(false)
        }
    }
    createFlex() {
        return new TTBElementFlex()
    }
    createElement(tag) {
        return new TTBElement(tag)
    }
    _getResponseHandler(name, handlers) {
        return name in handlers ? handlers[name] : this._response_handlers[name]
    }
    setResponseHandler(handlers) {
        this._response_handlers = handlers
    }
    request(parametars = {}) {  
        const method = parametars.method || "GET";  
        const url = parametars.path || "/";  
        const headers = parametars.headers || {};  
        const async = parametars.async !== false;
        const username = parametars.username || null;  
        const password = parametars.password || null;  
        const responseType = parametars.responseType || "text";  
        const responseHandler = (...args) => this._getResponseHandler(...args)
        let xhr = new XMLHttpRequest();  
        xhr.open(method, url, async, username, password);  
        for (const key in headers) xhr.setRequestHeader(key, headers[key]);   
        xhr.responseType = responseType;  
        xhr = (parametars.xhr && parametars.xhr(xhr)) || xhr
        return new Promise((resolve, reject) => {  
            var func
            xhr.onload = () => {  
                if (xhr.status >= 200 && xhr.status < 300) { 
                    func = responseHandler("success", parametars)
                    func && func(xhr);  
                    resolve(xhr.response);  
                } else {
                    func = responseHandler("error", parametars)
                    func && func(xhr);   
                    reject(xhr);  
                }  
            };  
            xhr.onerror = () => {
                func = responseHandler("error", parametars)
                func && func(xhr);   
                reject(new Error('Network Error'));  
            };  
            xhr.send(parametars.data || null);  
        });  
    }
    websocket(url, parameters = {}) {  
        return new WebSocketClient(url, parameters)
    }
    set_styles = (table) => {
        for (const key in table) this.set_style(key, table[key])
    }
    set_style = (tag, code) => {
        if (Array.isArray(code)) code = code.join(";")
        const styleRule = `${tag} { ${code} }`;  
        if (this.styles.includes(styleRule)) return;
        const textNode = document.createTextNode(styleRule);  
        const styleSheet = this.documentStyle.sheet;  
        if (styleSheet) {  
            try {  
                styleSheet.insertRule(styleRule, styleSheet.cssRules.length);  
            } catch (e) { 
                this.documentStyle.appendChild(textNode);  
            }  
        } else {
            this.documentStyle.appendChild(textNode);  
        }  
        this.styles.push(styleRule);  
    }
    calculateBytes(data) {  
        let bytes;
        if (typeof data === "string") bytes = (new TextEncoder()).encode(data).byteLength
        else if (data instanceof ArrayBuffer || data instanceof DataView || data instanceof Uint8Array) bytes = data.byteLength;
        else if (data instanceof Blob) bytes = data.size
        else if (data instanceof BytesBuffer) bytes = data.len()
        else bytes = (new TextEncoder()).encode(String(data)).byteLength
        return bytes;  
    } 
    sum(...arr) {
        let total = 0;
        for (const value of arr) {
            total += value;
        }
        return total;
    }
    avg(...arr) {
        return arr.length == 0 ? 0 : this.sum(...arr) / arr.length
    }
    isDOM(value) { return value instanceof HTMLElement ||  
        Object.prototype.toString.call(value) === '[object HTMLUnknownElement]' ||  
        (value && typeof value === 'object' && value.nodeType === 1 && typeof value.nodeName === 'string');  
    }
    collectionSingleList(...arr) {
        var array = []
        for (const data of arr) {
            if (Array.isArray(data)) array.push(...this.collectionSingleList(...data))
            else array.push(data)
        }
        return array
    }
    getURLParams() {return window.location.hash.indexOf("#") !== -1 ? window.location.hash.slice(1) : ""}
    getURLKey() {
        var key = this.getURLParams()
        return (key.startsWith("/") ? key.slice(1) : key).slice(0, key.indexOf("?") !== -1 ? key.indexOf("?") : key.length)
    }
    getURLKeyParams() {
        var key = this.getURLParams()
        key = key.startsWith("/") ? key.slice(1) : key
        if (key.indexOf("?") !== -1) {
            var params = {};
            var queries = (key.slice(key.indexOf("?"))).substring(1).split("&");
            for (var i = 0; i < queries.length; i++) {
                var pair = queries[i].split('=');
                if (pair[0]) params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
            return params;
        }
        return {}
    }
    getURLSearch(search = null) {
        var key = search != null ? search : window.location.search;
        if (key.indexOf("?") !== -1) {
            var params = {};
            var queries = (key.slice(key.indexOf("?"))).substring(1).split("&");

            for (var i = 0; i < queries.length; i++) {
                var pair = queries[i].split('=');
                if (pair[0]) params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
            return params;
        }
    }
    setURLSearch(params) {
        var content = '?'
        for (k in params) {
            v = params[k]
            if (!v) continue
            content += encodeURIComponent(k) + "=" + encodeURIComponent(v) + "&"
        }
        return content.slice(0, content.length - 1)
    }
    getTimestamp(date) {
        return (date || new Date()).valueOf()
    }
    getTime(date) {
        return this.getTimestamp(date) / 1000.0
    }
    clamp(min, cur, max) {  
        return Math.max(min, Math.min(cur, max));  
    } 
    runTaskLater(handler, delay, ...args) {
        return new Task(handler, delay, null, ...args)
    }
    runTaskRepeat(handler, delay, interval, ...args) {
        return new Task(handler, delay, interval, ...args)
    }
    createNotication(type, background, title, content) {
        return this._notifications.show(new TTBNotification(type, background, title, content))
    }
    randomUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0
          const v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
    }
}  
class TTBElement {
    constructor(tag, isElement = false) {
        this.base = isElement ? tag : document.createElement(tag)
        this._resize_handler = []
        window.addEventListener("resize", (...event) => this._resize(...event))
    }
    setHTML(content) {
        this.base.innerHTML = content;
        return this
    }
    setText(content) {
        this.base.innerText = content;
        return this
    }
    setValue(content) {
        this.base.value = content
        return this
    }
    title(content) {
        return this.setText(content)
    }
    html(content) {
        return this.setHTML(content)
    }
    append(...elements) {
        for (const element of elements) {
            if (element instanceof TTBElement) {
                this.base.append(element.valueOf())
            } else {
                this.base.append(element)
            }
        }
        return this
    }
    id(name) {
        this.base.id = name
        return this
    }
    class(...classes) {
        for (const clazz of classes) {
            for (const cls of clazz.split(" ")) this.base.classList.add(cls)
        }
        return this
    }
    toggle(clazz) {
        this.base.classList.toggle(clazz)
        return this;
    }
    style(style) {
        this.base.style = style
        return this;
    }
    _resize(...event) {
        for (const func of this._resize_handler) {
            try {
                func(...event)
            } catch (e) {
                console.log(e, func)
            }
        }
    }
    setStyle(key, value) {
        this.base.style[key] = value
        return this;
    }
    valueOf() {
        return this.base
    }
    containsClass(...classes) {
        for (const clazz of classes) {
            for (const cls of clazz.split(" ")) if (this.base.classList.contains(cls)) return true
        }
        return false
    }
    setAttribute(key, value) {
        this.base.setAttribute(key, value)
        return this
    }
    isDOM(value) { return value instanceof HTMLElement ||  
        Object.prototype.toString.call(value) === '[object HTMLUnknownElement]' ||  
        (value && typeof value === 'object' && value.nodeType === 1 && typeof value.nodeName === 'string');  
    };
    clear() {
        while (this.base.firstChild != null) this.base.removeChild(this.base.firstChild)
        return this
    }
    event(name, func) {
        if (name == "resize") {
            this._resize_handler.push(func)
            return this
        }
        this.base.addEventListener(name, func)
        return this
    }
    getChildrens() {
        [].findIndex
        return new Array(...this.base.children).map(v => {
            if (this.isDOM(v) && v.classList.contains("ttb-flex")) g_TTB._flexes.filter(val => val.valueOf() == v)[0]
            return new TTBElement(v, true)
        })
    }
}
class TTBElementFlex extends TTBElement {
    constructor(tag = "div", isElement = false) {
        super(tag, isElement)
        g_TTB.addFlex(this)
        this.class("ttb-flex")
        this._minwidth  = null
        this._minheight = null
        this._maxwidth  = null
        this._maxheight = null
        this._updateTimer = null
        this._child = 1
        this._childStyle = ''
        this._tag = null
        this._resizes = []
        this._disable = false
        this.update()
    }
    disable() {
        this._disable = true
        return this
    }
    addResize(func) {
        this._resizes.push(func)
        return this
    }
    append(...elements) {
        super.append(...elements.map(e => this.isDOM(e) || e instanceof TTBElement ? e : (new TTBElement("div")).setHTML(e)))
        return this
    }
    tag(tag) {
        this._tag = tag
        return this
    }
    min_width(width) {
        this.minwidth = width
        return this
    }
    max_width(width) {
        this.maxwidth = width
        return this
    }
    min_height(height) {
        this.minheight = height
        return this
    }
    max_height(height) {
        this.maxheight = height
        return this
    }
    height(height) {
        this.setStyle("height", height)
        return this
    }
    width(width) {
        this.setStyle("width", width)
        return this
    }
    style(key, value) {
        g_TTB.set_style(".ttb-flex." + key + "_" + value, `${key}: ${value}`)
        this.class(key + "_" + value)
        return this
    }
    update(main = true) {
        if (this._disable) return this
        const width = (super.valueOf().offsetWidth - 1)
        let minwidth = this._calcValueWithDisplay(this._minwidth || 0, width)
        let maxwidth = this._calcValueWithDisplay(this._maxwidth, width)
        let newwidth = Number.parseInt(g_TTB.clamp(minwidth, width, maxwidth) / 2) * 2
        const width_avg = Math.max(0, Math.floor((newwidth - 1) / this._child))
        for (const child of this.getChildrens()) {
            const child_style = window.getComputedStyle(child.valueOf())
            const margin = (parseInt(child_style.marginRight, 10) + parseInt(child_style.marginLeft, 10))
            child.valueOf().style = this._childStyle
            child.setStyle("boxSizing", "border-box")
            child.setStyle("width", (newwidth <= minwidth ? width : (width_avg - (Number.isNaN(margin) ? 0 : margin))) + "px")
        }
        for (const func of this._resizes) {
            func()
        }
        if (!main) return this
        g_TTB.resizeFlex(main)
        return this
    }
    _calcValueWithDisplay(value, display) { 
        if (value == -1 || value == null) return display
        if (typeof value === 'string' && value.includes('%')) {  
            return Math.floor(display * (parseFloat(value.replace('%', '')) / 100));  
        } else {  
            return value;  
        }  
    }  
    childStyle(value) {
        this._childStyle = value
        return this
    }
    minWidth(value) {
        this._minwidth = value
        return this
    }
    minHeight(value) {
        this._minheight = value
        return this
    }
    maxWidth(value) {
        this._maxwidth = value
        return this
    }
    maxHeight(value) {
        this._maxheight = value
        return this
    }
    child(value) {
        this._child = Math.max(1, Number.parseInt(value.toString()))
        return this
    }
}
class TTBModal extends TTBElement {
    constructor() {
        super("div")
        this._thenClose = () => {}
        this.class("ttb-modal")
        this.event("click", (event) => {
            if (event.target == this.valueOf() && this._thenClose) {
                this._thenClose(event)
            }
        })
        this._close = true
        this._task = null
    }
    thenClose(handler) {
        this._thenClose = handler
        return this
    }
    open(...body) {
        this._task?.block()
        this.append(...body)
        document.body.appendChild(this.valueOf())
        document.body.style.overflow = "hidden"
        this._close = false
        this._task = g_TTB.runTaskLater(() => this.class("show"), 50)
        return this
    }
    close() {
        if (this._close) return this
        this.base.classList.remove("show")
        this._task?.block()
        this._task = g_TTB.runTaskLater(() => this._real_close(), 200)
        return this;
    }
    _real_close() {
        while (this.valueOf().firstChild != null) this.valueOf().removeChild(this.valueOf().firstChild)
        document.body.style.overflow = ""
        document.body.removeChild(this.valueOf())
        window.dispatchEvent(new Event("resize"))
    }
}
class TTBNotification extends TTBElement {
    constructor(type, background, title, content) {
        super("div")
        this._type = type
        this._title = title
        this._content = content
        this.class("ttb-notification")
        this.setStyle("background-color", background || (type == "warn" ? (type == "error" ? "#FF3D71" : "#FFAA00") : "#FFFFFF"))
        this.append(title || '', content || '')
        this.id(g_TTB.randomUUID())
    }
}
class TTBNotificationManager extends TTBElement {
    constructor() {
        super("div")
        this.class("ttb-notifications")
        this._tasks = {}
    }
    init() {
        document.body.appendChild(this.valueOf())
    }
    show(element) {
        if (element.valueOf().id in this._tasks) clearTimeout(this._tasks[element.valueOf().id])
        this.valueOf().prepend(element.valueOf())
        this._tasks[element.valueOf().id] = setTimeout(() => {
            element.class("show")
            this._tasks[element.valueOf().id] = setTimeout(() => {
                element.base.classList.remove("show")
                this._tasks[element.valueOf().id] = setTimeout(() =>
                    this.remove(element)
                , 200)
            }, 5000)
        }, 50)
        element.event("click", () => {
            clearTimeout(this._tasks[element.valueOf().id])
            element.base.classList.remove("show")
            this._tasks[element.valueOf().id] = setTimeout(() =>
                this.remove(element)
            , 200)
        })
        return element
    }
    remove(element) {
        clearTimeout(this._tasks[element.valueOf().id])
        this.base.removeChild(element.valueOf())
        delete this._tasks[element.valueOf().id]
    }
}
class Task {
    constructor(func, delay, interval = null, ...args) {
        this.func = func
        this.args = args
        this.delay = delay
        this.interval = interval
        this._task = setTimeout(() => this._run(), delay)
    }
    _run() {
        try {
            this.func(...this.args)
        } catch (error) {
            console.error(...error)
        }
        if (this.interval != null) {
            this._task = setTimeout(() => this._run(), this.interval)
        }
    }
    block() {
        if (this._task != null) clearTimeout(this._task)
        this._task = null
    }
}
class WebSocketClient {
    constructor(url, handlers = {}) {
        this.url = url;
        this.ws = null;
        this.reconnectInterval = 1000;  // 重连间隔为1秒
        this.retryMessage = !(handlers.retryMessage || true)
        this.messageQueue = [];  // 用于缓存消息的队列
        this.handlers = handlers;  // 处理函数的对象
        this.stats = {
            sent: { count: 0, length: 0 },
            received: { count: 0, length: 0 }
        };
        this.connect()
        this.reconnectTask = null;
    }

    close() {
        this.ws.close();
    }

    connect() {
        this.ws = new WebSocket(this.url);

        // 当连接打开时，发送所有缓存的消息，并调用处理函数
        this.ws.onopen = () => {
            if (this.reconnectTask !== null) {
                clearInterval(this.reconnectTask)
                this.reconnectTask = null
            }
            while (this.messageQueue.length > 0) {
                let message = this.messageQueue.shift();
                this.send(message)
            }
            if (this.handlers.onopen) {
                this.handlers.onopen();
            }
        };

        // 当接收到消息时，调用处理函数
        this.ws.onmessage = (event) => {
            this.stats.received.count++;
            this.stats.received.length += event.data.length;
            if (this.handlers.onmessage) {
                this.handlers.onmessage(event);
            }
        };

        // 当连接关闭时，尝试重新连接，并调用处理函数
        this.ws.onclose = () => {
            this.ws = null
            if (this.handlers.onclose) {
                this.handlers.onclose();
            }
            this.reconnectTask = setTimeout(() => this.connect(), this.reconnectInterval)
        };
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.stats.sent.count++;
            this.stats.sent.length += g_TTB.calculateBytes(data);
            this.ws.send(data instanceof BytesBuffer ? data.toBytes() : data);
        } else {
            if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
                this.connect();
            }
            if (this.retryMessage)
                this.messageQueue.push(data);
        }
    }

    getStats() {
        return this.stats;
    }
}
class MinecraftUtils {
    static getVarInt(data) {
        let r = [];
        while (true) {
            if ((data & 0xFFFFFF80) === 0) {
                r.push(data);
                break;
            }
            r.push(data & 0x7F | 0x80);
            data >>= 7;
        }
        return r;
    }
    static getVarIntLength(data) {
        return this.getVarInt(data).length;
    }
}
class BytesBuffer {
    constructor(...data) {
        this.buffer = []
        this.cur = 0
        this.write(...data)
    }
    write(...values) {
        for (const value of values) {
            if (value instanceof BytesBuffer) {
                this.buffer.push(...value.buffer)
            } else if (Number.isInteger(value)) {
                this.buffer.push(value < 0 ? value + 256 : value)
            } else if (Array.isArray(value) && value.filter(v => Number.isInteger(v)).length == value.length) {
                value.forEach(v => this.write(v))
            } else if (value instanceof Uint8Array) {
                for (let i = 0; i < value.byteLength; i++) {
                    this.write(value[i])
                }
            } else if (value instanceof ArrayBuffer) {
                this.write(new Uint8Array(value))
            } else if (!value === undefined) {
                console.log(typeof value, "buf", value)
            }
        }
    }
    read(length = 1) {
        let data = []
        for (let i = 0; i < length; i++) data.push(...this.buffer.slice(this.cur + i, this.cur + i + 1))
        this.cur += length
        return data;
    }
    tell() {
        return this.cur
    }
    readBytes(length) {
        return this.read(length);
    }
    sizeof() {
        return this.buffer.length;
    }
    len() {
        return this.buffer.length;
    }
    toBytes() {
        return new Uint8Array(this.buffer)
    }
    copy() {
        let buf = []
        this.buffer.forEach(v => buf.push(v))
        return buf
    }
}
class DataOutputStream extends BytesBuffer {
    constructor(data) {
        super()
        this.write(data)
    }
    writeInteger(value) {
        this.write((value >> 24) & 0xFF, (value >> 16) & 0xFF, (value >> 8) & 0xFF, (value >> 0) & 0xFF);
    }
    writeBoolean(value) {
        this.write(value ? 1 : 0)
    }
    writeFloat(value) {
        const bytes = new Uint8Array((new Float32Array([value])).buffer);  
        for (let i = 0; i < 4; i++) {  
            this.write(bytes[i]);  
        }  
    }
    writeDouble(value) {
        const bytes = new Uint8Array((new Float64Array([value])).buffer);  
        for (let i = 0; i < 8; i++) {  
            this.write(bytes[i]);  
        }  
    }
    writeVarInt(value) {
        this.write(MinecraftUtils.getVarInt(value));
        return this;
    }
    writeString(data, encoding = 'utf-8') {
        this.writeVarInt(data.length);
        this.write(new TextEncoder(encoding).encode(data));
        return this;
    }
    writeLong(data) {
        data = data - (data > Math.pow(2, 63) - 1 ? Math.pow(2, 64) : data);
        this.write((data >> 56) & 0xFF, (data >> 48) & 0xFF, (data >> 40) & 0xFF, (data >> 32) & 0xFF, (data >> 24) & 0xFF, (data >> 16) & 0xFF, (data >> 8) & 0xFF, (data >> 0) & 0xFF);
        return this;
    }
    writeUUID(uuid) {
        this.writeLong(uuid.int >> 64);
        this.writeLong(uuid.int & ((1 << 64) - 1));
        return this;
    }
}
class DataInputStream extends BytesBuffer {
    readInteger() {
        let value = this.read(4)
        return ((value[0] << 24) + (value[1] << 16) + (value[2] << 8) + (value[3] << 0))
    }
    readBoolean() {
        return Boolean(this.read(1)[0]);
    }
    readShort() {
        value = this.read(2);
        if (value[0] | value[1] < 0)
            throw EOFError()
        return ((value[0] << 8) + (value[1] << 0))
    }
    readLong() {
        let value = this.read(8)
        value = (
            (value[0] << 56) +
            ((value[1] & 255) << 48) +
            ((value[2] & 255) << 40) +
            ((value[3] & 255) << 32) +
            ((value[4] & 255) << 24) +
            ((value[5] & 255) << 16) +
            ((value[6] & 255) << 8) +
            ((value[7] & 255) << 0))
        return value < BigInt(Math.pow(2, 63) - 1) ? value : value - BigInt(Math.pow(2, 64));
    }
    readDouble() {
        return (new DataView(new Uint8Array(this.readBytes(4)))).getFloat64()
    }
    readFloat() {
        return (new DataView(new Uint8Array(this.readBytes(4)))).getFloat32()
    }
    readVarInt() {
        let i = 0;
        let j = 0;
        let k;
        while (true) {
            k = this.read(1)[0];
            i |= (k & 0x7F) << j * 7;
            j += 1;
            if (j > 5) throw new Error("VarInt too big");
            if ((k & 0x80) !== 128) break;
        }
        return i >= 2 ** 31 - 1 ? i - 2 ** 31 * 2 : i;
    }
    readString(maximum = null, encoding = 'utf-8') {
        return new TextDecoder(encoding).decode(new Uint8Array(this.read(maximum == null ? this.readVarInt() : maximum)));
    }
    readBytes(length) {
        return this.read(length);
    }
    readUUID() {
        let m = this.readLong();
        let l = this.readLong();
        return new UUID(m.toBytes().concat(l.toBytes()));
    }
}
g_TTB = null;