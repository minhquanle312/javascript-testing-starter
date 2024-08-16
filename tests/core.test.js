import { it, expect, describe } from 'vitest'
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  validateUserInput,
} from '../src/core'

describe('getCoupons', () => {
  it('should return an array of coupons', () => {
    const coupons = getCoupons()
    expect(Array.isArray(coupons)).toBe(true)
    expect(coupons.length).toBeGreaterThan(0)
  })

  it('should return an array with valid coupon codes', () => {
    const coupons = getCoupons()
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('code')
      expect(typeof coupon.code).toBe('string')
      expect(coupon.code).toBeTruthy()
    })
  })

  it('should return an array with valid coupon discounts', () => {
    const coupons = getCoupons()
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('discount')
      expect(typeof coupon.discount).toBe('number')
      expect(coupon.discount).toBeGreaterThan(0)
      expect(coupon.discount).toBeLessThan(1)
    })
  })
})

describe('calculateDiscount', () => {
  it('should return discounted to price if given valid coupon', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9)
    expect(calculateDiscount(10, 'SAVE20')).toBe(8)
  })
  it('should handle nom-numeric price', () => {
    expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i)
  })
  it('should handle negative price', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i)
  })
  it('should handle non-string discount code', () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i)
  })
  it('should handle invalid discount code', () => {
    expect(calculateDiscount(10, 'INVALID')).toBe(10)
  })
})

describe('validateUserInput', () => {
  it('should return success if given a valid input', () => {
    expect(validateUserInput('test', 18)).toMatch(/success/i)
  })
  it('should return an error if username is not a string', () => {
    expect(validateUserInput(1, 18)).toMatch(/invalid/i)
  })
  it('should return an error if username is less than 3 characters', () => {
    expect(validateUserInput('qu', 18)).toMatch(/invalid/i)
  })
  it('should return an error if username is longer than 255 characters', () => {
    expect(validateUserInput('a'.repeat(256), 18)).toMatch(/invalid/i)
  })
  it('should return an error if age is not a number', () => {
    expect(validateUserInput('quan', '18')).toMatch(/invalid/i)
  })
  it('should return an error if age is less than 18', () => {
    expect(validateUserInput('quan', 17)).toMatch(/invalid/i)
  })
  it('should return an error if age is greater than 100', () => {
    expect(validateUserInput('quan', 101)).toMatch(/invalid/i)
  })
  it('should return an error if both username and age are invalid', () => {
    expect(validateUserInput('', 0)).toMatch(/invalid username/i)
    expect(validateUserInput('', 0)).toMatch(/invalid age/i)
  })
})

describe('isPriceInRange', () => {
  it.each([
    { scenario: 'price < min', price: -10, result: false },
    { scenario: 'price > max', price: 200, result: false },
    { scenario: 'price = min', price: 0, result: true },
    { scenario: 'price = max', price: 100, result: true },
    { scenario: 'min < price < max', price: 50, result: true },
  ])('should return $result for $scenario', ({ price, result }) => {
    expect(isPriceInRange(price, 0, 100)).toBe(result)
  })

  it('should return true when the price is within the range', () => {
    expect(isPriceInRange(50, 0, 100)).toBe(true)
  })
})

describe('isValidUserName', () => {
  const minLength = 5
  const maxLength = 15

  it('should return false if username is too short', () => {
    expect(isValidUsername('a'.repeat(minLength - 1))).toBe(false)
  })
  it('should return false if username is too long', () => {
    expect(isValidUsername('a'.repeat(maxLength + 1))).toBe(false)
  })
  it('should return true if username is at the min or max length', () => {
    expect(isValidUsername('a'.repeat(minLength))).toBe(true)
    expect(isValidUsername('a'.repeat(maxLength))).toBe(true)
  })
  it('should return true if username is within the length constraint', () => {
    expect(isValidUsername('a'.repeat(minLength + 1))).toBe(true)
    expect(isValidUsername('a'.repeat(maxLength - 1))).toBe(true)
  })
  it('should return false for invalid input type', () => {
    expect(isValidUsername(null)).toBe(false)
    expect(isValidUsername(undefined)).toBe(false)
    expect(isValidUsername(1)).toBe(false)
  })
})

describe('canDrive', () => {
  it('should return an error if for invalid countryCode', () => {
    expect(canDrive(10, 'VN')).toMatch(/invalid/i)
    expect(canDrive(10, 'us')).toMatch(/invalid/i)
  })

  it.each([
    { age: 15, country: 'US', result: false },
    { age: 16, country: 'US', result: true },
    { age: 17, country: 'US', result: true },
    { age: 16, country: 'UK', result: false },
    { age: 17, country: 'UK', result: true },
    { age: 18, country: 'UK', result: true },
  ])('should return $result for $age, $country', ({ age, country, result }) => {
    expect(canDrive(age, country)).toBe(result)
  })
})

describe('fetchData', () => {
  it('should return a promise that with resolve to an array of numbers', async () => {
    try {
      const result = await fetchData()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    } catch (error) {
      expect(error).toHaveProperty('reason')
      expect(error.reason).toMatch(/fail/i)
    }
  })
})
