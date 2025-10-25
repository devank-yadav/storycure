import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function Auth() {
  const { requestEmailOtp, verifyEmailOtp } = useAuth()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const [sending, setSending] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()
  const next = loc.state?.from?.pathname || '/dashboard'

  const sendCode = async (e) => {
    e?.preventDefault?.()
    setErr(''); setInfo(''); setSending(true)
    try {
      await requestEmailOtp(email.trim())
      setStep('otp')
      setInfo('We sent a 6-digit code to your email.')
    } catch (e) { setErr(e.message || 'Could not send code') }
    finally { setSending(false) }
  }

  const verifyCode = async (e) => {
    e?.preventDefault?.()
    setErr(''); setSending(true)
    try {
      await verifyEmailOtp({ email: email.trim(), token: code.trim() })
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No session after OTP')
      const { count } = await supabase.from('children').select('id', { head: true, count: 'exact' })
      if ((count ?? 0) === 0) nav('/onboarding', { replace: true })
      else nav(next, { replace: true })
    } catch (e) { setErr(e.message || 'Invalid or expired code') }
    finally { setSending(false) }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: '0 auto', padding: 20 }}>
        {step === 'email' ? (
          <>
            <h2 className="h2">Welcome to StoryCure</h2>
            <p className="p">Enter your email — we’ll send a 6-digit code. No password needed.</p>
            <form className="form" onSubmit={sendCode}>
              <div><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
              {err && <p className="p" style={{ color:'var(--danger)' }}>{err}</p>}
              {info && <p className="p" style={{ color:'var(--primary-700)' }}>{info}</p>}
              <div className="row" style={{ justifyContent:'flex-end' }}>
                <button className="btn" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send code'}</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="h2">Check your inbox</h2>
            <p className="p">Enter the 6-digit code we sent to <b>{email}</b>.</p>
            <form className="form" onSubmit={verifyCode}>
              <div>
                <label>Code</label>
                <input inputMode="numeric" pattern="[0-9]*" maxLength={6}
                  value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))} required />
              </div>
              {err && <p className="p" style={{ color:'var(--danger)' }}>{err}</p>}
              <div className="row" style={{ justifyContent:'space-between' }}>
                <button type="button" className="btn-ghost" onClick={()=>setStep('email')}>← Change email</button>
                <div>
                  <button type="button" className="btn-ghost" onClick={sendCode} disabled={sending}>Resend</button>
                  <button className="btn" type="submit" disabled={sending}>{sending ? 'Verifying…' : 'Verify & continue'}</button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}