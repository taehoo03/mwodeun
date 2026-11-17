
import { useEffect, useState } from 'react'
import axios from 'axios'

function GiftBox({ setPage }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('sent')

  const loginUser = JSON.parse(
    localStorage.getItem('loginUser')
  )

  const memberId = loginUser?.memberId

  useEffect(() => {
    loadOrders()
  }, [tab, memberId])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken')

    return {
      Authorization: `Bearer ${token}`
    }
  }

  const loadOrders = async () => {
    if (!memberId) {
      setOrders([])
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const url =
        tab === 'sent'
          ? 'http://localhost:8080/api/orders'
          : 'http://localhost:8080/api/orders/received'

      const params =
        tab === 'sent'
          ? { memberId }
          : { receiverId: memberId }

      const response = await axios.get(url, {
        params,
        headers: getAuthHeaders()
      })

      setOrders(response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.')
      } else if (error.response?.status === 403) {
        alert('선물함에 접근할 권한이 없습니다.')
      } else {
        alert('선물함을 불러오지 못했습니다.')
      }

      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  if (!loginUser) {
    return (
      <div className="gift-box-page">

        <div className="gift-box-title">
          <span>GIFT BOX</span>

          <h2>선물함</h2>

          <p>
            로그인하면 내가 주고받은 선물을 확인할 수 있습니다.
          </p>
        </div>

        <div className="gift-box-empty">

          <h3>로그인이 필요합니다.</h3>

          <p>
            선물함을 이용하려면 먼저 로그인해주세요.
          </p>

          <button onClick={() => setPage('login')}>
            로그인하기
          </button>

        </div>

      </div>
    )
  }

  if (loading) {
    return (
      <div className="gift-box-page">

        <div className="gift-box-title">
          <span>GIFT BOX</span>
          <h2>선물함</h2>
        </div>

        <div className="gift-box-empty">
          선물함을 불러오는 중입니다.
        </div>

      </div>
    )
  }

  return (
    <div className="gift-box-page">

      <div className="gift-box-title">

        <span>GIFT BOX</span>

        <h2>선물함</h2>

        <p>
          내가 주고받은 선물을 확인할 수 있습니다.
        </p>

      </div>

      <div className="gift-box-tabs">

        <button
          className={tab === 'sent' ? 'active' : ''}
          onClick={() => setTab('sent')}
        >
          보낸 선물
        </button>

        <button
          className={tab === 'received' ? 'active' : ''}
          onClick={() => setTab('received')}
        >
          받은 선물
        </button>

      </div>

      {orders.length === 0 ? (
        <div className="gift-box-empty">

          <h3>
            {tab === 'sent'
              ? '아직 보낸 선물이 없습니다.'
              : '아직 받은 선물이 없습니다.'}
          </h3>

          <p>
            {tab === 'sent'
              ? '친구에게 선물할 상품을 골라보세요.'
              : '친구가 선물을 보내면 여기에 표시됩니다.'}
          </p>

          {tab === 'sent' && (
            <button onClick={() => setPage('friends')}>
              친구에게 선물하기
            </button>
          )}

        </div>
      ) : (
        <div className="gift-order-list">

          {orders.map((order, index) => (
            <div
              className="gift-order-card"
              key={order.orderId || index}
            >

              <div className="gift-order-image">
                상품 이미지
              </div>

              <div className="gift-order-info">

                <span>
                  {order.category || '선물'}
                </span>

                <h3>
                  {order.productName || '상품'}
                </h3>

                <p>
                  수량 {order.quantity || 1}개
                </p>

                {tab === 'received' && (
                  <p>받은 선물</p>
                )}

              </div>

              <div className="gift-order-price">

                <strong>
                  {(order.totalPrice || 0).toLocaleString()}원
                </strong>

                <span>
                  {order.status ||
                    order.orderStatus ||
                    '주문완료'}
                </span>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}

export default GiftBox
