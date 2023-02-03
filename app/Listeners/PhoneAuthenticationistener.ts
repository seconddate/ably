import { EventsList } from '@ioc:Adonis/Core/Event'

export default class PhoneAuthenticationistener {
  public async handleSendSms (phoneAuthentication: EventsList['sendPhoneAuthentication:phoneAuthentication']) {
    console.log(`${phoneAuthentication.phoneNumber.replace(/-/gims, '')} - 인증 번호는 ${phoneAuthentication.verificationCode}입니다.`)
  }
}

