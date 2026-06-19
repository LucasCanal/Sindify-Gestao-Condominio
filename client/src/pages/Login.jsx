import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle, ShieldCheck, Users, BarChart3 } from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe]     = useState(false)
  const [errors, setErrors]             = useState({})
  const [windowWidth, setWindowWidth]   = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const { login, loading }              = useAuthStore()
  const navigate                        = useNavigate()

  const isMobile = windowWidth < 900

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const savedEmail = localStorage.getItem('sindify_remember_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const validate = () => {
    const next = {}
    if (!email.trim()) {
      next.email = 'Informe seu e-mail.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Digite um e-mail válido.'
    }
    if (!password) {
      next.password = 'Informe sua senha.'
    } else if (password.length < 6) {
      next.password = 'A senha deve ter ao menos 6 caracteres.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    if (rememberMe) {
      localStorage.setItem('sindify_remember_email', email)
    } else {
      localStorage.removeItem('sindify_remember_email')
    }

    const result = await login(email, password)
    if (result.ok) {
      toast.success('Bem-vindo!')
      navigate('/dashboard')
    } else {
      toast.error(result.message)
      setErrors({ form: result.message || 'Não foi possível entrar. Verifique seus dados.' })
    }
  }

  const inputBaseStyle = {
    width: '100%',
    padding: '12px 14px 12px 42px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#1e1b4b',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box'
  }

  const focusField = (e) => {
    e.target.style.borderColor = '#7c3aed'
    e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'
  }

  const blurField = (fieldHasError) => (e) => {
    e.target.style.borderColor = fieldHasError ? '#ef4444' : '#e5e7eb'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: isMobile ? 'column' : 'row', fontFamily: 'inherit' }}>

      {/* ── LADO ESQUERDO: FORM ── */}
      <div style={{
        flex: isMobile ? 'none' : '1 1 50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        padding: isMobile ? '40px 20px' : '40px 24px'
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          {/* Logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: isMobile ? '32px' : '48px' }}
            onClick={() => navigate('/')}
          >
            <div style={{
              width: '34px',
              height: '38px',
              background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #1e1b4b 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)',
              flexShrink: 0
            }}>
              <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '22px', fontStyle: 'italic', fontFamily: 'sans-serif', transform: 'translateX(-1px)' }}>S</span>
            </div>
            <span style={{ color: '#1e1b4b', fontWeight: '600', fontSize: '26px', letterSpacing: '-0.8px' }}>
              Sindify<span style={{ fontWeight: '400', color: '#1e1b4b' }}>Gestão</span>
            </span>
          </div>

          {/* Título */}
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1e1b4b', marginBottom: '8px' }}>
            Acesse sua conta
          </h1>
          <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px' }}>
            Gerencie seu condomínio com transparência e eficiência.
          </p>

          {/* Erro geral do form */}
          {errors.form && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '13px', color: '#991b1b', lineHeight: '1.4' }}>{errors.form}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: '500' }}>
                E-mail
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })) }}
                  style={{ ...inputBaseStyle, borderColor: errors.email ? '#ef4444' : '#e5e7eb' }}
                  onFocus={focusField}
                  onBlur={blurField(!!errors.email)}
                />
              </div>
              {errors.email && (
                <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px', display: 'block' }}>
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>Senha</label>
                <a href="/esqueci-senha" style={{ fontSize: '13px', color: '#7c3aed', textDecoration: 'none', fontWeight: '500' }}>
                  Esqueceu a senha?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: undefined })) }}
                  style={{ ...inputBaseStyle, padding: '12px 42px 12px 42px', borderColor: errors.password ? '#ef4444' : '#e5e7eb' }}
                  onFocus={focusField}
                  onBlur={blurField(!!errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px', display: 'block' }}>
                  {errors.password}
                </span>
              )}
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#7c3aed', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: '#374151' }}>Lembrar de mim</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '4px',
                padding: '13px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.15s, transform 0.1s'
              }}
              onMouseDown={(e) => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              {loading
                ? <Loader2 size={16} className="animate-spin" />
                : <>Entrar <ArrowRight size={16} /></>
              }
            </button>
          </form>

          {/* Divisor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          {/* Login social */}
          <button
            type="button"
            onClick={() => toast('Login com Google em breve.')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'background 0.15s, border-color 0.15s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#d1d5db' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e5e7eb' }}
          >
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.084 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Entrar com Google
          </button>

          {/* CTA principal de cadastro */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(124,58,237,0.05)',
            border: '1px solid rgba(124,58,237,0.15)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
              Ainda não tem conta?
            </p>
            <a
              href="/registro"
              onClick={(e) => { e.preventDefault(); navigate('/registro') }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '8px',
                color: '#7c3aed',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              Criar minha conta <ArrowRight size={14} />
            </a>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '20px' }}>
            Sindify Gestão Condominial © {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* ── LADO DIREITO: ARTE / GRADIENTE ── */}
      {!isMobile && (
        <div style={{
          flex: '1 1 50%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #050314 0%, #3b1a75 60%, #7c3aed 100%)',
          overflow: 'hidden'
        }}>
          {/* glow decorativo */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'rgba(167,139,250,0.25)',
            filter: 'blur(80px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-15%',
            left: '-10%',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: 'rgba(91,33,182,0.3)',
            filter: 'blur(90px)'
          }} />

          {/* grid sutil decorativo */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 100%)'
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '440px', padding: '0 48px', textAlign: 'left' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              color: '#d8b4fe',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              — Sindify Gestão Condominial
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: '600', color: '#ffffff', lineHeight: '1.3', marginBottom: '16px' }}>
              Eficiência que transforma a vida em condomínio.
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '36px' }}>
              Transparência, organização e facilidade em uma única plataforma para síndicos e moradores.
            </p>

            {/* Mini cards de destaque */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '14px 16px',
                backdropFilter: 'blur(6px)'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9px',
                  background: 'rgba(167,139,250,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldCheck size={18} color="#d8b4fe" />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', margin: 0 }}>98% de satisfação</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>entre os síndicos parceiros</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '14px 16px',
                backdropFilter: 'blur(6px)'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9px',
                  background: 'rgba(167,139,250,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Users size={18} color="#d8b4fe" />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', margin: 0 }}>+500 condomínios</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>gerenciados em todo o Brasil</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '14px 16px',
                backdropFilter: 'blur(6px)'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9px',
                  background: 'rgba(167,139,250,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <BarChart3 size={18} color="#d8b4fe" />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', margin: 0 }}>Gestão financeira automatizada</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>relatórios e transparência total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}