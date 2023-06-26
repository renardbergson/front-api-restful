const productsList = document.querySelector('#products-list')
const form = document.querySelector('#form')

// ======= GET =======
function listProducts() {
    fetch('http://localhost:8080/api/products')
    .then(response => response.json())
    .then(data => {
        const productsHtml = data.map(product => 
            `<li>${product.name} - ${product.brand} - ${product.price}</li>`
        ).join('')

        //console.log(productsHtml)

        productsList.innerHTML = productsHtml

        /* data.forEach(product => {
            const productsHtml = `<li>${product.name} - ${product.brand} - ${product.price}</li>`
            
            //console.log(productsHtml)

            productsList.innerHTML += productsHtml
        }) */
    })   
}

listProducts()

// ======= POST ======= 
form.onsubmit = e => {
    e.preventDefault()

    const name = form.name.value
    const brand = form.brand.value
    const price = form.price.value

    if (name && brand && price != '') {   
        fetch('http://localhost:8080/api/products', {
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