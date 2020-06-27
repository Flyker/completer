export class LazyCaller {
    constructor(onstart = () => {}, onprepare = () => {}, waitTime = 800) {
        this._TimerId = null;
        this.WaitTime = waitTime;
        this.onprepare = onprepare;
        this.onstart = onstart;        
    }
    //
    prepare(args) {
        //отменяем предыдущий запрос
        if (this._TimerId) {
            clearTimeout(this._TimerId);
            this._TimerId = null;
        }
        //
        this._call(this.onprepare, args);
        //готовим запрос, но откладываем отправку на WaitTime мс
        this._TimerId = setTimeout((a) => {
            //Отправка запроса
            this._call(this.onstart, args);
            this._TimerId = null;
        }, this.WaitTime, ...args);
    }

    _call(callback, args) {
        if (callback) {
            if (typeof callback === 'function') {
                callback(args);
            }
        }
    }
}

//export { LazyCaller }             =>  import { LazyCaller } from './.../lazy-caller'
//module.exports = { LazyCaller }   =>  const { LazyCaller } = require('./.../lazy-caller')