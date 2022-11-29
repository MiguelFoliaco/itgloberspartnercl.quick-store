import React, { useEffect, useRef, useState } from 'react'
import { useLazyQuery, useMutation } from "react-apollo";
import UPDATE_CART from '../../graphql/UpdateCart.graphql';
import GET_PRODUCT from '../../graphql/GetProductBySKU.graphql';
const QuickStore = () => {

  const [sku, setSku] = useState('');
  const [cuantity, setCuantity] = useState(1)
  const ref = useRef<HTMLInputElement>(null)
  const [addToCart] = useMutation(UPDATE_CART)
  const [getProductData, { data, loading }] = useLazyQuery(GET_PRODUCT)

  const handleChangeInput = (e: any) => {
    setSku(e.target.value);
  }

  const handleChangeInputQuantity = (e: any) => {
    let _cuantity = e.target.value as number;
    if (data === undefined) {
      return;
    }
    setCuantity(_cuantity * data.product.items.unitMultiplier);
  }

  const noSubmit = (e: any) => {
    e.preventDefault();
    if (sku === '') {
      alert("Por favor envie un dato valido")
      return;
    }

    getProductData({
      variables: {
        sku
      }
    })
  }

  useEffect(() => {
    _addToCart();
  }, [data])


  const _addToCart = () => {
    console.log(sku)
    if (data === undefined) {
      return;
    };
    const { productId } = data.product;
    const newIdInt = parseInt(productId);
    console.log(data.product)

    addToCart({
      variables: {
        items: {
          id: newIdInt,
          quantity: 1,
          seller: 1
        },
        salesChannel: "1"
      }
    })
      .then(res => {
        if (res.data !== undefined) {
          alert('Producto agregado correctamente');
          return;
        }
        console.log(res)
      })
      .catch(err => {
        alert('Ocurrio un error inesperado')
        console.log(err)
      })

  }

  return (
    <div>
      <div>
        <h3>Compra rapida!</h3>
      </div>

      {
        loading && <p>loading...</p>
      }
      <form onSubmit={noSubmit}>
        <div>
          <label htmlFor="sku">Ingrese el numero de SKU</label>
          <input ref={ref} type='number' name='sku' value={sku} onChange={handleChangeInput} />
        </div>
        {
          data === undefined ? <p>Ningun producto seleccionado</p>
            :
            <div>
              <label htmlFor="cuantity">Cantidad</label>
              <input type='number' name='cuantity' value={cuantity} onChange={handleChangeInputQuantity} />
            </div>
        }
        <div>
          <p>Buscando: {sku}</p>
          <button type="submit">Buscar</button>
        </div>
      </form>

    </div>
  )
}

export { QuickStore }
