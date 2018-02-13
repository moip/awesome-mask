'use strict'

import VMasker from 'vanilla-masker'
import Vue from 'vue'
import { inputHandler } from './event-listener'

let applyMaskToDefault = (el, mask, isMoney, firstBind = false) => {
  const inputText = getInputText(el);
  if(isMoney && inputText.value.length > 0){
    if(inputText.value.toString().indexOf('.') > 0 && firstBind) {
      let value = inputText.value * 100
      inputText.value = VMasker.toMoney(value, {showSignal: true});
    }
    inputText.value = VMasker.toMoney(inputText.value, {showSignal: true});
  } else {
    inputText.value = mask && mask.length > 0 ? VMasker.toPattern(inputText.value, mask) : inputText.value
  }
}

let getInputText = (el) => {
  let isInputText = el instanceof HTMLInputElement ;
  let inputText = el;
  if(!isInputText){
    inputText = el.querySelector('input')
  }
  return inputText;
}

export default {
  bind (el, binding) {
    let isMoney = false;
    if(binding.value.length < 1) return
    const inputText = getInputText(el);
    inputText.setAttribute('data-mask', binding.value)
    if(binding.value === 'money'){
      isMoney = true;
    } else {
      let maskSize = inputText.getAttribute('data-mask').length
      inputText.setAttribute('maxlength', maskSize)
    }
    applyMaskToDefault(inputText, binding.value, isMoney, true)
    inputText.addEventListener('keyup', inputHandler)
  },
  update(el, binding) {
    // this is only for v-model
    if(binding.value.length < 1) return
    const inputText = getInputText(el);
    if(binding.value === 'money'){
      applyMaskToDefault(inputText ,binding.value, true)
      return
    }
    inputText.setAttribute('data-mask', binding.value)
    inputText.setAttribute('maxlength', inputText.getAttribute('data-mask').length)
    applyMaskToDefault(inputText ,binding.value)
  },
  unbind(el, binding) {
    if(binding.value.length < 1) return
    const inputText = getInputText(el);
    inputText.removeAttribute('maxlength')
    inputText.removeEventListener('keyup', inputHandler)
  }
}