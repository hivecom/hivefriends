import { isEmpty, isNil } from 'lodash'
import { reactive, watch } from 'vue'

/**
 * Types
 */

export interface Error {
  type: string | null
  invalid: boolean
  errors: Set<string>
}

export interface Errors {
  [key: string]: Error
}

export interface ValidationRule {
  _validate: (value?: any) => boolean
  _message: (value?: string) => string
}

export interface Rule {
  [key: string]: ValidationRule
}

interface ValidationOptions {
  // Perform validation on each value update
  proactive?: boolean
  autoclear?: boolean
}

/**
 * Composable
 */

export function useFormValidation(
  form: object,
  rules: any,
  { proactive = false, autoclear = false }: ValidationOptions = {},
) {
  const errors = reactive<Errors>({})

  const root = reactive({ anyError: false, pending: false })

  if (autoclear) {
    watch(
      form,
      () => {
        reset()
      },
      { deep: true },
    )
  }

  if (proactive) {
    watch(
      form,
      () => {
        validate()
      },
      { deep: true },
    )
  }

  // Initial assignment
  reset()

  function _resetErrorObject() {
    Object.assign(errors, {
      ...Object.keys(form).reduce(
        (a, v) => ({
          ...a,
          [v]: {
            type: null,
            invalid: false,
            errors: new Set(),
          },
        }),
        {},
      ),
    })

    Object.assign(root, { anyError: false, pending: false })
  }

  function reset() {
    // Resets the form
    _resetErrorObject()
  }

  async function validate() {
    _resetErrorObject()

    root.pending = true

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      for (const [key, value] of Object.entries(form)) {
        if (!Reflect.has(rules.value, key))
          continue

        const itemRules: Rule = rules.value[key]

        for (const [ruleKey, ruleData] of Object.entries(itemRules)) {
          const { _message, _validate }: ValidationRule = ruleData

          const result = await _validate(value)

          if (!result) {
            root.anyError = true

            // Is error
            errors[key].type = ruleKey
            errors[key].invalid = true
            errors[key].errors.add(_message())
          }
        }
      }

      if (root.anyError) {
        reject(errors)
      }
      else {
        resolve(true)
      }

      root.pending = false
    })
  }

  return {
    errors,
    reset,
    validate,
    status: root,
  }
}

/**
 * Validations
 *
 * @Rule Returns FALSE if failed, returns TRUE if passed
 */

export const required = {
  _validate(value: any) {
    return !isEmpty(value) && value.length > 0
  },
  _message() {
    return 'Value is required'
  },
}

export function minLength(len: number) {
  return {
    _validate(value: any) {
      if (isNil(value))
        return false

      return value?.length ? value.length >= len : false
    },
    _message() {
      return `Value must be at least ${len} characters long`
    },
  }
}

export function asyncValidation(executable: (value?: any) => Promise<boolean>) {
  return {
    async _validate(value: any) {
      return await executable(value)
    },
    _message() {
      return 'not implemented'
    },
  }
}

export function maxLength(len: number) {
  return {
    _validate(value: any) {
      if (isNil(value) || value.length === 0)
        return true

      return value?.length ? value.length <= len : false
    },
    _message() {
      return `Value must be equal or smaller than ${len} characters`
    },
  }
}

export const email = {
  _validate(value: any) {
    return /^\S[^\s@]*@\S[^\s.]*\.\S+$/.test(value)
  },
  _message() {
    return 'Value must be in a valid email format'
  },
}

export function sameAs(compared: any, leanient: boolean = false) {
  return {
    _validate(value: any) {
      return leanient ? value === compared : value === compared
    },
    _message() {
      return 'Values do not match'
    },
  }
}
