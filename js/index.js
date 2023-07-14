const api_url = 'https://projeto-api-restful.onrender.com/api/products'
const products = document.querySelector('#products')
const form = document.querySelector('#form')
const listProductsBtn = document.querySelector('#listProducts')
const pricePreview = document.querySelector('.pricePreview')

form.price.oninput = e => {
    const priceLenth = e.target.value.length
    const priceNumber = +e.target.value
    
    if (priceLenth === 0) {
        addOrRemoveClasses('pricePreview', 'add', 'invisible')
    } else {
        const formated = priceNumber.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
        pricePreview.innerHTML = formated
        addOrRemoveClasses('pricePreview', 'remove', 'invisible')
        console.log(form.price.value)
    }
}

// ======= START =======
listProductsBtn.onclick = () => {
    listProducts()
    addOrRemoveClasses('form', 'add', 'hidden')
    addOrRemoveClasses('products', 'remove', 'hidden')
}

// ======= GET =======
function listProducts() {
    const message = document.querySelector('#message')
    const loadingGif = document.querySelector('#loadingGif')
    const productsList = document.querySelector('#products-list')
    const goToRegister = document.querySelector('#goToRegister')

    fetch(api_url)
    .then(response => response.json())
    .then(data => {
        let productsHtml

        if (data && data.length != 0) {
            addOrRemoveClasses('loadingGif', 'add', 'hidden')
            addOrRemoveClasses('message', 'add', 'hidden')

            productsHtml = data.map(product => `
            <li>
                ${product.name} - ${product.brand} - R$ ${priceConvert(product.price)} 
                - 
                <a href="#" class="edit-btn" data-id=${product._id} data-name=${product.name} data-brand=${product.brand} data-price=${product.price}>[editar]</a>
    
                <a href="#" class="delete-btn" data-id=${product._id}>[excluir]</a>
            </li>
            `).join('')
        } else {
            addOrRemoveClasses('loadingGif', 'add', 'hidden')
            addOrRemoveClasses('message', 'add', 'hidden')

            productsHtml = '<li>Ops, não há produtos cadastrados <br> ou ocorreu algum erro na requisição!</li>'
        }

        //console.log(productsHtml)
        /*  data.forEach(product => {
            const productsHtml = `<li>${product.name} - ${product.brand} - ${product.price}</li>`
            
            //console.log(productsHtml)

            productsList.innerHTML += productsHtml
        }) */

        productsList.innerHTML = productsHtml
        
        editProduct()
        deleteProduct()
    })   

    goToRegister.onclick = () => {
        addOrRemoveClasses('products', 'add', 'hidden')
        addOrRemoveClasses('form', 'remove', 'hidden')
    }
}

// ======= POST ======= 
form.onsubmit = e => {
    e.preventDefault()

    const name = form.name.value
    const brand = form.brand.value
    const price =  form.price.value

    if (name && brand && price != '') {
        fetch(api_url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: name,
                brand: brand,
                price: price,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'product succesfully saved') {
                alert('Produto cadastrado com sucesso!')
                form.reset() // reseting form fields
                addOrRemoveClasses('pricePreview', 'add', 'invisible')
                listProducts() // refreshing products list in the screen
            } else {
                alert('Ops, ocorreu algum erro, tente novamente!')
            }
        })
    }
}

// ======= PUT =======
function editProduct() {
    const editForm = document.querySelector('#editForm')
    const editBtns = document.querySelectorAll('.edit-btn')
    const cancelBtn = document.querySelector('#cancelBtn')

    editBtns.forEach(button => button.onclick = function (e) {
        e.preventDefault()

        const {id, name, brand, price} = this.dataset
        
        editForm.id.value = id
        editForm.name.value = name
        editForm.brand.value = brand
        editForm.price.value = priceConvert(price)

        addOrRemoveClasses('editForm', 'remove', 'hidden')

        editForm.onsubmit = e => {
            e.preventDefault()

            const _id = editForm.id.value
            const _name = editForm.name.value
            const _brand = editForm.brand.value
            const _price = priceConvert(editForm.price.value, 'ok')

            overWriteProduct(_id, _name, _brand, _price)
        }  
    })

    function overWriteProduct (id, name, brand, price) {
        fetch(`${api_url}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: name,
                brand: brand,
                price: price
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'product succesfully updated') {
                listProducts()
                alert('Produto alterado com sucesso!')
                editForm.reset()
                addOrRemoveClasses('editForm', 'add', 'hidden')
            } else {
                alert('Ops, ocorreu algum erro, tente novamente!')
            }
        })
    }

    cancelBtn.onclick = e => {
        e.preventDefault()
        editForm.reset()
        addOrRemoveClasses('editForm', 'add', 'hidden')
    }
}

// ======= DELETE =======
function deleteProduct() {
    const deleteBtns = document.querySelectorAll('.delete-btn')

    deleteBtns.forEach(button => button.onclick = function (e) {
        e.preventDefault()
        
        const id = this.dataset.id
        const question = prompt('Deseja mesmo excluir este produto? Digite "sim"')

        if (question === null || question === 'null' || question === '') {
            return
        } else if (question === 'sim' || question === 'Sim') {
            fetch(`${api_url}/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'product succesfully removed') {
                    listProducts() // refreshing products list in the screen
                } else {
                    alert('Ops, ocorreu algum erro, tente novamente!')
                }
            })
        }
    })
}

// ======= Visibility Control =======
function addOrRemoveClasses (item, addOrRemove, className) {
    const command = `${item}.classList.${addOrRemove}('${className}')`
    const teste = new Function(command)
    return teste()
}

// Price Convert and Format
function priceConvert (priceOutput, response) {
    if (typeof(priceOutput) === 'number') {
        const format = priceOutput.toFixed(2).replace('.' , ',')
        return format
    }

    if (typeof(priceOutput) === 'string' && response === undefined) {
        const convert = +priceOutput
        const format = convert.toFixed(2).replace('.' , ',')
        return format
    }

    if (typeof(priceOutput === 'string') && response === 'ok') {
        const replace = priceOutput.replace(',' , '.').replace('R$', '')
        return replace
    }
}