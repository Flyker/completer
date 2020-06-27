import './scss/index.scss'
const { Subject } = require('rxjs')
import { LazyCaller } from './core/lazy-caller'

//Имитатор задержки ответов с сервера
let lastsubj$ = new Subject()
let search_data = null;

//Работа с отложенными запросами
let lazyCaller = new LazyCaller((data) => {
    //старт вызова запроса
    console.log(`Start search ${data} - ${Date.now()}`)    
    //Имитация задержки с сервера 2500-5500мс
    let duration = 2500 + (Math.random() * (5500 - 2500))
    search_data = data;
    lastsubj$ = new Subject()
    lastsubj$.subscribe(value => {
        //окончание запроса - получение результатов
        console.log(`End search ${value} - ${Date.now()}`)
    })
    setTimeout(([s, v])=>{ s.next(v) }, duration, [lastsubj$, data])
}, (data) => {
    //подготовка запроса к вызову
    console.log(`Prepare ${data} - ${Date.now()}`)
});

//работа с DOM элементами
let SearchTextElem = document.getElementById('text_search')
SearchTextElem.addEventListener('keyup', (event) => {
    //отменяем предыдущую имитацию запроса
    if (search_data) { console.log(`Cancel search ${search_data} - ${Date.now()}`) }
    lastsubj$.complete()
    search_data = null;
    //обрабатываем текущее значение
    let search_pattern = `${event.target.value}`
    search_pattern = search_pattern.trim()
    if (search_pattern.length <= 2) {return}
    //готовим новый вызов
    lazyCaller.prepare(search_pattern)
});