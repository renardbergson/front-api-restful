const api_link = 'http://localhost:8080/api/products'
const productsList = document.querySelector('#products-list')
const form = document.querySelector('#form')

// ======= GET =======
function listProducts() {
    fetch(api_link)
    .then(response => response.json())
    .then(data => {
        const productsHtml = data.map(product => `
        <li>
        ${product.name} - ${product.brand} - ${product.price} - <a href="#" class="delete-btn" 
        data-id=${product._id}>[excluir]</a>
        </li>
        `).join('')

        //console.log(productsHtml)

        /*  data.forEach(product => {
            const productsHtml = `<li>${product.name} - ${product.brand} - ${product.price}</li>`
            
            //console.log(productsHtml)

            productsList.innerHTML += productsHtml
        }) */

        productsList.innerHTML = productsHtml
        
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
        fetch(api_link, {
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

// ======= DELETE =======
function deleteProduct() {
    const deleteBtns = document.querySelectorAll('.delete-btn')

    deleteBtns.forEach(button => button.onclick = function (e) {
        e.preventDefault()
        
        const id = this.dataset.id
        const question = prompt('Tem certeza de que deseja excluir este produto? Digite "sim"')

        if (question === 'sim' || 'Sim') {
            fetch(`${api_link}/${id}`, {
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