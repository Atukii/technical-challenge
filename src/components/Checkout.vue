<template>
  <div class="container">
    <h1>Checkout</h1>

    <div class="checkout-grid">
      <!-- trolley Summary -->
      <div class="card">
        <h2>Order Summary</h2>
        
        <div class="trolley-item">
          <div>
            <div class="item-name">Wireless Headphones</div>
            <div class="item-quantity">Qty: 1</div>
          </div>
          <div class="item-price">£89.99</div>
        </div>

        <div class="trolley-item">
          <div>
            <div class="item-name">USB-C Cable</div>
            <div class="item-quantity">Qty: 2</div>
          </div>
          <div class="item-price">£19.98</div>
        </div>

        <div class="trolley-item">
          <div>
            <div class="item-name">Phone Case</div>
            <div class="item-quantity">Qty: 1</div>
          </div>
          <div class="item-price">£24.99</div>
        </div>

        <div class="price-section">
          <div class="price-row subtotal">
            <span>Subtotal</span>
            <span id="subtotal">£{{ subtotalStore.toFixed(2) }}</span>
          </div>
          <div class="price-row discount" v-if="appliedDiscount > 0">
            <span>promo Discount</span>
            <span id="discount-amount">-£{{ appliedDiscount.toFixed(2) }}</span>
          </div>
          <div class="price-row total">
            <span>Total</span>
            <span id="total">£{{ totalStore.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Checkout Form -->
      <div class="card">
        <div v-if="errorMessage" class="alert alert-error show" data-testid="error-alert">
          ⚠️ {{ errorMessage }}
        </div>

        <!-- Checkout Form Section -->
        <form v-if="!orderConfirmed" @submit.prevent="handleSubmit" data-testid="checkout-form">
          <h2>Shipping Details</h2>

          <!-- promo Section -->
          <div class="promo-section">
            <label>Promo Code (Optional)</label>
            <div class="promo-input-group">
              <input 
                v-model="formData.promoCode"
                type="text" 
                placeholder="Enter code"
                data-testid="promo-input"
                :disabled="promoApplied"
              >
              <button 
                type="button" 
                class="btn btn-promo"
                @click="handleApplyPromo"
                data-testid="apply-promo-btn"
                :disabled="promoApplied"
              >
                Apply
              </button>
            </div>
            <div v-if="promoApplied" class="success-message show" data-testid="promo-success">
              promo applied! You save £{{ appliedDiscount.toFixed(2) }}
            </div>
            <div v-if="promoError" class="error-message show" data-testid="promo-error">
              {{ promoError }}
            </div>
          </div>

          <!-- Address Section -->
          <div class="address-section">
            <label style="font-weight: 600; margin-bottom: 15px;">Address</label>

            <div class="form-group">
              <input 
                v-model="formData.firstName"
                type="text" 
                placeholder="First Name"
                data-testid="first-name"
                :class="{ error: validationErrors.firstName }"
              >
              <div v-if="validationErrors.firstName" class="error-message show" data-testid="first-name-error">
                {{ validationErrors.firstName }}
              </div>
            </div>

            <div class="form-group">
              <input 
                v-model="formData.lastName"
                type="text" 
                placeholder="Last Name"
                data-testid="last-name"
                :class="{ error: validationErrors.lastName }"
              >
              <div v-if="validationErrors.lastName" class="error-message show" data-testid="last-name-error">
                {{ validationErrors.lastName }}
              </div>
            </div>

            <div class="form-group">
              <input 
                v-model="formData.address"
                type="text" 
                placeholder="Street Address"
                data-testid="address"
                :class="{ error: validationErrors.address }"
              >
              <div v-if="validationErrors.address" class="error-message show" data-testid="address-error">
                {{ validationErrors.address }}
              </div>
            </div>

            <div class="address-grid">
              <div class="form-group">
                <input 
                  v-model="formData.city"
                  type="text" 
                  placeholder="City"
                  data-testid="city"
                  :class="{ error: validationErrors.city }"
                >
                <div v-if="validationErrors.city" class="error-message show" data-testid="city-error">
                  {{ validationErrors.city }}
                </div>
              </div>

              <div class="form-group">
                <select 
                  v-model="formData.country"
                  data-testid="country"
                  :class="{ error: validationErrors.country }"
                >
                  <option value="">Select Country</option>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
                <div v-if="validationErrors.country" class="error-message show" data-testid="country-error">
                  {{ validationErrors.country }}
                </div>
              </div>
            </div>

            <div class="form-group">
              <input 
                v-model="formData.postcode"
                type="text" 
                placeholder="Post Code"
                data-testid="postcode"
                :class="{ error: validationErrors.postcode }"
              >
              <div v-if="validationErrors.postcode" class="error-message show" data-testid="postcode-error">
                {{ validationErrors.postcode }}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary"
            data-testid="pay-button"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading-spinner show"></span>
            {{ isLoading ? 'Processing...' : `Pay £${totalStore.toFixed(2)}` }}
          </button>
        </form>

        <!-- Success State -->
        <div v-else class="success-state show">
          <div class="success-icon">✓</div>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase.</p>
          <div class="order-number" data-testid="order-number">
            Order #{{ orderNumber }}
          </div>
          <p style="color: #999; font-size: 13px; margin-bottom: 0;">
            A confirmation email has been sent to your address.
          </p>
          <button 
            type="button" 
            class="btn btn-secondary"
            @click="resetCheckout"
            data-testid="continue-shopping"
            style="margin-top: 20px;"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FormDataType {
  firstName: string
  lastName: string
  address: string
  city: string
  country: string
  postcode: string
  promoCode: string
}

interface ValidationErrorsType {
  firstName?: string
  lastName?: string
  address?: string
  city?: string
  country?: string
  postcode?: string
}

const subtotal = 134.96
const promoCode = 'SAVE10'
const promoDiscount = 13.50

const formData = ref<FormDataType>({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  country: '',
  postcode: '',
  promoCode: '',
})

const validationErrors = ref<ValidationErrorsType>({})
const promoError = ref<string>('')
const promoApplied = ref<boolean>(false)
const appliedDiscount = ref<number>(0)
const isLoading = ref<boolean>(false)
const errorMessage = ref<string>('')
const orderConfirmed = ref<boolean>(false)
const orderNumber = ref<string>('')

const subtotalStore = computed(() => subtotal)
const totalStore = computed(() => subtotal - appliedDiscount.value)

function handleApplyPromo() {
  const code = formData.value.promoCode.trim().toUpperCase()

  if (!code) {
    promoError.value = 'Please enter a promo code'
    return
  }

  if (code === promoCode) {
    appliedDiscount.value = promoDiscount
    promoApplied.value = true
    promoError.value = ''
  } else {
    promoError.value = 'Invalid promo code'
    appliedDiscount.value = 0
    promoApplied.value = false
  }
}

function validateForm(): boolean {
  validationErrors.value = {}

  if (!formData.value.firstName.trim()) {
    validationErrors.value.firstName = 'First name is required'
  }

  if (!formData.value.lastName.trim()) {
    validationErrors.value.lastName = 'Last name is required'
  }

  if (!formData.value.address.trim()) {
    validationErrors.value.address = 'Address is required'
  }

  if (!formData.value.city.trim()) {
    validationErrors.value.city = 'City is required'
  }

  if (!formData.value.country.trim()) {
    validationErrors.value.country = 'Country is required'
  }

  // Postcode validation: at least 5 characters, must include digits
  const postcode = formData.value.postcode.trim()
  if (!postcode || postcode.length < 5 || !/\d/.test(postcode)) {
    validationErrors.value.postcode = 'Valid postal code is required (5+ characters, must include digits)'
  }

  return Object.keys(validationErrors.value).length === 0
}

function simulatePayment(): Promise<void> {
  return new Promise((resolve, reject) => {
    const delay = 2000 + Math.random() * 1000 // 2-3 seconds
    const shouldFail = Math.random() < 0.5 // 50% chance of failure

    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Payment gateway timeout. Please retry.'))
      } else {
        resolve()
      }
    }, delay)
  })
}

async function handleSubmit(): Promise<void> {
  errorMessage.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    await simulatePayment()
    orderNumber.value = `ORD-${Math.random().toString(36).split('.')[1].toUpperCase()}`
    orderConfirmed.value = true
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Payment failed. Please try again.'
    isLoading.value = false
  }
}

function resetCheckout() {
  formData.value = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postcode: '',
    promoCode: '',
  }
  validationErrors.value = {}
  promoError.value = ''
  promoApplied.value = false
  appliedDiscount.value = 0
  errorMessage.value = ''
  orderConfirmed.value = false
  orderNumber.value = ''
  isLoading.value = false
}
</script>

<style scoped>

.container {
  max-width: 900px;
  margin: 0 auto;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

h1, h2 {
  color: var(--text-dark);
  font-size: 24px;
}

h1 {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  font-size: 32px;
}

.trolley-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
}

/* for anyone looking at this - apply border bottom on any .trolley-item that has another .trolley-item after it*/
.trolley-item:has(+ .trolley-item) {
  border-bottom: 1px solid #eee;}

.item-name {
  font-weight: 500;
  color: var(--text-dark);
}

.item-quantity {
  color: var(--text-light);
  font-size: 14px;
  margin: 5px 0;
}

.item-price {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 16px;
}

.price-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #eee;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
}

.price-row.subtotal {
  color: var(--text-light);
}

.price-row.discount {
  color: var(--success-color);
  font-weight: 600;
}

.price-row.total {
  color: var(--text-dark);
  font-weight: 700;
  font-size: 18px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}
form {
  display: grid;
  gap: 15px;
}
label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-dark);
  font-weight: 500;
  font-size: 14px;
}

input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s;
}

input:focus, select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

input.error {
  border-color: var(--error-color);
}

input:disabled, select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.error-message {
  color: var(--error-color);
  font-size: 13px;
  margin-top: 5px;
  display: none;
}

.error-message.show {
  display: block;
}

.success-message {
  color: var(--success-color);
  font-size: 13px;
  margin-top: 5px;
  display: none;
}

.success-message.show {
  display: block;
}

.promo-section {
  background: var(--bg-light);
  padding: 15px;
  border-radius: 4px;
}

.promo-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.promo-input-group input {
  flex: 1;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #7f8c8d;
}

.btn-promo {
  background: var(--primary-color);
  color: white;
  flex: 0 0 auto;
  padding: 12px 20px;
}

.btn-promo:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-promo:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}

.loading-spinner {
  display: none;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner.show {
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.alert {
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: none;
  font-size: 14px;
}

.alert.show {
  display: block;
}

.alert-error {
  background: #fadbd8;
  border: 1px solid #f5b7b1;
  color: #c0392b;
}

.success-state {
  display: none;
  text-align: center;
}

.success-state.show {
  display: block;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: var(--success-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40px;
}

.success-state h2 {
  color: var(--success-color);
  margin-bottom: 10px;
}

.success-state p {
  color: var(--text-light);
  margin-bottom: 20px;
}

.order-number {
  background: var(--bg-light);
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-family: monospace;
  color: var(--primary-color);
  font-weight: 600;
}
.address-section {
  display: grid;
  grid-template-columns: 1;
  gap: 15px;
}
.address-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.address-grid .form-group {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .address-grid {
    grid-template-columns: 1fr;
  }
}
</style>
