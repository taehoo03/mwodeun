
import { useState } from 'react'
import axios from 'axios'

function SpringTest() {
  const [products, setProducts] = useState([])
  const [message, setMessage] = useState('')

  const loginUser = JSON.parse(
    localStorage.getItem('loginUser')
  )

  const isAdmin = loginUser?.role === 'ADMIN'

  const handleTest = async () => {
    if (!isAdmin) {
      setMessage('관리자만 DB 테스트를 실행할 수 있습니다.')
      return
    }

    const token = localStorage.getItem('accessToken')

    if (!token) {
      setMessage('로그인 정보가 없습니다. 다시 로그인해주세요.')
      return
    }

    try {
      const response = await axios.get(
        'http://localhost:8080/api/products',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setProducts(response.data)
      setMessage('DB 상품 데이터 가져오기 성공!')
    } catch (error) {
      setProducts([])

      if (error.response?.status === 401) {
        setMessage('로그인 정보가 만료되었습니다. 다시 로그인해주세요.')
      } else if (error.response?.status === 403) {
        setMessage('접근 권한이 없습니다.')
      } else {
        setMessage('DB 상품 데이터 가져오기 실패')
      }
    }
  }

  if (!isAdmin) {
    return (
      <div className="friends-page">

        <div className="friends-title">
          <div>
            <h2>접근 권한 없음</h2>
            <p>
              DB 테스트는 관리자만 이용할 수 있습니다.
            </p>
          </div>
        </div>

      </div>
    )
  }

  return (
    <div className="friends-page">

      <div className="friends-title">
        <div>
          <h2>DB 상품 데이터 테스트</h2>
          <p>
            Oracle DB에 저장된 상품을 Spring 서버에서 가져옵니다.
          </p>
        </div>
      </div>

      <div className="friend-detail">

        <button onClick={handleTest}>
          DB 상품 가져오기
        </button>

        {message && (
          <p>{message}</p>
        )}

        {products.length > 0 && (
          <div>
            {products.map((product) => (
              <div key={product.productId}>
                <p>상품번호: {product.productId}</p>
                <p>카테고리: {product.category}</p>
                <p>상품명: {product.productName}</p>
                <p>설명: {product.description}</p>
                <p>가격: {product.price.toLocaleString()}원</p>
                <p>재고: {product.stock}개</p>
                <hr />
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  )
}

export default SpringTest
