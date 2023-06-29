const api_url = 'http://localhost:8080/api/products'
const productsList = document.querySelector('#products-list')
const form = document.querySelector('#form')
const editForm = document.querySelector('#editForm')

// ======= GET =======
function listProducts() {
    fetch(api_url)
    .then(response => response.json())
    .then(data => {
        const productsHtml = data.map(product => `
        <li>
            ${product.name} - ${product.brand} - ${product.price} - 
            <a href="#" class="edit-btn" data-id=${product._id} data-name=${product.name} data-brand=${product.brand} data-price=${product.price}>[editar]</a>

            <a href="#" class="delete-btn" data-id=${product._id}>[excluir]</a>
        </li>
        `).join('')

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
} listProducts()

// ======= POST ======= 
form.onsubmit = e => {
    e.preventDefault()

    const name = form.name.value
    const brand = form.brand.value
    const price = form.price.value

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
                listProducts() // refreshing products list in the screen
            } else {
                alert('Ops, ocorreu algum erro, tente novamente!')
            }
        })
    }
}

// ======= PUT =======
function editProduct() {
    const editBtns = document.querySelectorAll('.edit-btn')
    const cancelBtn = document.querySelector('#cancelBtn')

    editBtns.forEach(button => button.onclick = function (e) {
        e.preventDefault()

        const {id, name, brand, price} = this.dataset
        
        editForm.id.value = id
        editForm.name.value = name
        editForm.brand.value = brand
        editForm.price.value = price

        visibilityControl(form, editForm)

        editForm.onsubmit = e => {
            e.preventDefault()

            const _id = editForm.id.value
            const _name = editForm.name.value
            const _brand = editForm.brand.value
            const _price = editForm.price.value

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
                visibilityControl(editForm, form)
            } else {
                alert('Ops, ocorreu algum erro, tente novamente!')
            }
        })
    }

    cancelBtn.onclick = e => {
        e.preventDefault()
        
        editForm.reset()
        
        visibilityControl(editForm, form)
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
                    alert('Produto removido com sucesso!')
                    listProducts() // refreshing products list in the screen
                } else {
                    alert('Ops, ocorreu algum erro, tente novamente!')
                }
            })
        }
    })
}

// ======= Visibility Control =======
function visibilityControl (item1, item2) {
    item1.classList.add('hidden')
    item2.classList.remove('hidden')
}