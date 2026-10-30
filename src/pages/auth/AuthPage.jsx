import { useState } from 'react'
import { ArrowLeft, ArrowRight, GraduationCap, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/UI.jsx'
import { useApp } from '../../hooks/useApp.js'

const roles = ['Admin', 'Teacher', 'Student', 'Parent']

export default function AuthPage({ mode }) {
  const [role, setRole] = useState('Admin')
  const [email, setEmail] = useState('alex@northstar.edu')
  const [password, setPassword] = useState('acadex-demo')
  const [notice, setNotice] = useState('')
  const { login } = useApp()
  const navigate = useNavigate()
  const register = mode === 'register'
  const forgot = mode === 'forgot'
  const reset = mode === 'reset'

  function submit(event) {
    event.preventDefault()
    if (forgot || reset) {
      setNotice(forgot ? 'If an account exists for this address, a reset link is on its way.' : 'Your password has been updated. You can sign in now.')
      return
    }
    if (!email.trim() || !password.trim()) {
      setNotice('Please enter both your email address and password.')
      return
    }
    login(role, email.trim())
    navigate('/portal')
  }

  return <div className="auth-page"><div className="auth-brand"><Link to="/" className="brand"><span className="brand-mark"><GraduationCap size={19} /></span><span>acadex</span></Link><span className="auth-secure"><ShieldCheck size={14} /> A thoughtful space for your school</span></div><div className="auth-decoration"><div className="auth-deco-card"><span className="auth-deco-star"><Sparkles size={17} /></span><small>YOUR SCHOOL, IN SYNC</small><strong>Better days<br />start together.</strong><div className="auth-deco-people"><span>AM</span><span>SC</span><span>JR</span><span>+84</span></div></div><div className="auth-deco-caption"><span>✳</span> A calmer way to do school.</div></div><main className="auth-main"><div className="auth-card"><Link to="/" className="back-home"><ArrowLeft size={15} /> Back to home</Link><div className="auth-heading"><span className="auth-mobile-icon"><GraduationCap size={20} /></span><h1>{register ? 'Find your school’s rhythm.' : forgot ? 'A fresh start.' : reset ? 'Make it yours again.' : 'Welcome back.'}</h1><p>{register ? 'Get your school community connected in just a few steps.' : forgot ? 'Enter your email and we’ll send a reset link your way.' : reset ? 'Choose a new password for your Acadex account.' : 'Pick up right where your school day left off.'}</p></div>{!forgot && !reset && <div className="role-picker"><label>I’m signing in as</label><div className="role-options">{roles.map((item) => <button type="button" className={role === item ? 'role-option role-selected' : 'role-option'} key={item} onClick={() => setRole(item)}>{item}</button>)}</div></div>}<form onSubmit={submit} className="auth-form">{register && <label>Full name<input type="text" placeholder="How should we call you?" required /></label>}<label>Email address<span className="input-icon"><Mail size={16} /><input type="email" placeholder="you@school.edu" value={email} onChange={(event) => setEmail(event.target.value)} required /></span></label>{!forgot && <label>{reset ? 'New password' : 'Password'}<span className="input-icon"><LockKeyhole size={16} /><input type="password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} /></span></label>}{!register && !forgot && !reset && <div className="auth-inline"><label className="remember-check"><input type="checkbox" defaultChecked /> Remember me</label><Link to="/forgot-password">Forgot password?</Link></div>}{notice && <p className="auth-notice" role="status">{notice}</p>}<Button type="submit" className="auth-submit">{forgot ? 'Send reset link' : reset ? 'Update password' : register ? 'Create your account' : 'Sign in to Acadex'} <ArrowRight size={16} /></Button></form>{!forgot && !reset && <div className="demo-hint"><Sparkles size={14} /><span><strong>Just exploring?</strong> Choose any role above and sign in with the demo details.</span></div>}{forgot && <p className="auth-switch"><Link to="/login"><ArrowLeft size={14} /> Back to sign in</Link></p>}{reset && <p className="auth-switch"><Link to="/login"><ArrowLeft size={14} /> Back to sign in</Link></p>}{!forgot && !reset && <p className="auth-switch">{register ? 'Already part of Acadex?' : 'New to Acadex?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></p>}<p className="auth-legal">By continuing, you agree to Acadex’s <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p></div></main><footer className="auth-footer"><span>© 2026 Acadex</span><span>Made for the people behind every school day.</span></footer></div>
}
