const cards = document.getElementById('cards')
const items =  document.getElementById('items')
const footer =  document.getElementById('footer')

const templateCard = document.getElementById('template-card').content
const templateCar = document.getElementById('template-car').content
const templateFooter = document.getElementById('template-footer').content

const fragment = document.createDocumentFragment()

let car = {}

document.addEventListener('DOMContentLoaded', (e) => {
    fetchData()
})

cards.addEventListener('click', (e) => {
    addToCar(e)
})

items.addEventListener('click', (e) => {
    btnAction(e)
})

const fetchData = async () => {
    try {
        const api = await fetch('api.json')
        const data = await api.json()

        showProducts(data)
    } catch(error) {
        console.log(error)
    }
}

const showProducts = (products) => {
    products.forEach((product) => {
        templateCard.querySelector('h5').textContent = product.title
        templateCard.querySelector('p').textContent = product.precio
        templateCard.querySelector('img').setAttribute('src', product.thumbnaiUrl)
        templateCard.querySelector('.btn-dark').dataset.id = product.id

        const clone = templateCard.cloneNode(true)

        fragment.appendChild(clone)
    })

    cards.appendChild(fragment)
}

const addToCar = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCar(e.target.parentElement)
    }

    e.stopPropagation()
}

const setCar = object => {
    const product = {
        id: object.querySelector('.btn-dark').dataset.id,
        title: object.querySelector('h5').textContent,
        precio: object.querySelector('p').textContent,
        quantity: 1,
    }

    if (car.hasOwnProperty(product.id)) {
        product.quantity = car[product.id].quantity + 1
    }

    car[product.id] = {...product}
    showCar()
}

const showCar = () => {
    items.innerHTML = ''

    Object.values(car).forEach(product => {
        templateCar.querySelector('th').textContent = product.id
        templateCar.querySelectorAll('td')[0].textContent = product.title
        templateCar.querySelectorAll('td')[1].textContent = product.quantity
        templateCar.querySelector('.btn-info').dataset.id = product.id
        templateCar.querySelector('.btn-danger').dataset.id = product.id
        templateCar.querySelector('span').textContent = product.quantity * product.precio

        const cloneProduct = templateCar.cloneNode(true)

        fragment.appendChild(cloneProduct)
    })

    items.appendChild(fragment)

    showFooter()
}

const showFooter = () => {
    footer.innerHTML = ''

    if (Object.keys(car).length === 0) {
        footer.innerHTML = `
            <th scope="row" colspan="5"> Carrito vacio. ¡Comienze a comprar!</th>
        `

        return
    }

    const nQuantity = Object.values(car).reduce((acc, {quantity}) => acc + quantity, 0)
    const nPrecio = Object.values(car).reduce((acc, {quantity, precio}) => acc + quantity * precio, 0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nQuantity
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)

    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnEmpty = document.getElementById('empty-car')
    btnEmpty.addEventListener('click', () => {
        car = {}

        showCar()
    })
}

const btnAction = e => {
    if (e.target.classList.contains('btn-info')) {
        const product = car[e.target.dataset.id]

        product.quantity++
        car[e.target.dataset.id] = {...product}

        showCar()
    }

    if (e.target.classList.contains('btn-danger')) {
        const product = car[e.target.dataset.id]

        product.quantity--

        if (product.quantity === 0) {
            delete car[e.target.dataset.id]

            showCar()
        } else {
            car[e.target.dataset.id] = {...product}
        }

        showCar()
    }

    e.stopPropagation()
}
