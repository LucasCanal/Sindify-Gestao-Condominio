import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User as UserIcon, Phone, ArrowRight, Loader2, Eye, EyeOff, AlertCircle, Building2, Home } from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function CreateAccount() {
  const [role, setRole]                 = useState('morador')
  const [name, setName]                 = useState('')
  const [email, setEmail]               = useState('')
  const [phone, setPhone]               = useState('')
  const [apartmentLabel, setApartmentLabel] = useState('')
  const [password, setPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors]             = useState({})
  const [windowWidth, setWindowWidth]   = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const { register, loading }           = useAuthStore()
  const navigate                        = useNavigate()

  const isMobile = windowWidth < 900

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const validate = () => {
    const next = {}
    if (!name.trim()) next.name = 'Informe seu nome.'
    if (!email.trim()) {
      next.email = 'Informe seu e-mail.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Digite um e-mail válido.'
    }
    if (!password) {
      next.password = 'Crie uma senha.'
    } else if (password.length < 6) {
      next.password = 'A senha deve ter ao menos 6 caracteres.'
    }
    if (confirmPassword !== password) {
      next.confirmPassword = 'As senhas não coincidem.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const result = await register({
      name,
      email,
      password,
      phone,
      role,
      apartmentId: null,
    })

    if (result.ok) {
      toast.success('Conta criada com sucesso!')
      navigate('/dashboard')
    } else {
      toast.error(result.message)
      setErrors({ form: result.message || 'Não foi possível criar a conta.' })
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

  const clearError = (field) => {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }))
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
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: isMobile ? '28px' : '36px' }}
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
          <h1 style={{ fontSize: '26px', fontWeight: '600', color: '#1e1b4b', marginBottom: '6px' }}>
            Criar sua conta
          </h1>
          <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '24px' }}>
            Escolha seu perfil e comece a usar o Sindify.
          </p>

          {/* Seletor de role */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => setRole('morador')}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '14px 10px',
                borderRadius: '10px',
                border: role === 'morador' ? '1.5px solid #7c3aed' : '1px solid #e5e7eb',
                background: role === 'morador' ? 'rgba(124,58,237,0.06)' : '#ffffff',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s'
              }}
            >
              <Home size={18} color={role === 'morador' ? '#7c3aed' : '#9ca3af'} />
              <span style={{ fontSize: '13px', fontWeight: '500', color: role === 'morador' ? '#5b21b6' : '#6b7280' }}>
                Morador
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole('sindico')}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '14px 10px',
                borderRadius: '10px',
                border: role === 'sindico' ? '1.5px solid #7c3aed' : '1px solid #e5e7eb',
                background: role === 'sindico' ? 'rgba(124,58,237,0.06)' : '#ffffff',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s'
              }}
            >
              <Building2 size={18} color={role === 'sindico' ? '#7c3aed' : '#9ca3af'} />
              <span style={{ fontSize: '13px', fontWeight: '500', color: role === 'sindico' ? '#5b21b6' : '#6b7280' }}>
                Síndico
              </span>
            </button>
          </div>

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
              marginBottom: '18px'
            }}>
              <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '13px', color: '#991b1b', lineHeight: '1.4' }}>{errors.form}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label style={{ fontSize: '13px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: '500' }}>
                Nome completo
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError('name') }}
                  style={{ ...inputBaseStyle, borderColor: errors.name ? '#ef4444' : '#e5e7eb' }}
                  onFocus={focusField}
                  onBlur={blurField(!!errors.name)}
                />
              </div>
              {errors.name && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px', display: 'block' }}>{errors.name}</span>}
            </div>

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
                  onChange={(e) => { setEmail(e.target.value); clearError('email') }}
                  style={{ ...inputBaseStyle, borderColor: errors.email ? '#ef4444' : '#e5e7eb' }}
                  onFocus={focusField}
                  onBlur={blurField(!!errors.email)}
                />
              </div>
              {errors.email && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px', display: 'block' }}>{errors.email}</span>}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: '500' }}>
                  Telefone <span style={{ color: '#9ca3af', fontWeight: '400' }}>(opcional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={inputBaseStyle}
                    onFocus={focusField}
                    onBlur={blurField(false)}
                  />
                </div>
              </div>
            </div>

            {role === 'morador' && (
              <div>
                <label style={{ fontSize: '13px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: '500' }}>
                  Apartamento / bloco <span style={{ color: '#9ca3af', fontWeight: '400' }}>(opcional, pode vincular depois)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Home size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="text"
                    placeholder="Ex: Bloco B, apto 204"
                    value={apartmentLabel}
                    onChange={(e) => setApartmentLabel(e.target.value)}
                    style={inputBaseStyle}
                    onFocus={focusField}
                    onBlur={blurField(false)}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: '13px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: '500' }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError('password') }}
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
              {errors.password && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px', display: 'block' }}>{errors.password}</span>}
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: '500' }}>
                Confirmar senha
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword') }}
                  style={{ ...inputBaseStyle, borderColor: errors.confirmPassword ? '#ef4444' : '#e5e7eb' }}
                  onFocus={focusField}
                  onBlur={blurField(!!errors.confirmPassword)}
                />
              </div>
              {errors.confirmPassword && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px', display: 'block' }}>{errors.confirmPassword}</span>}
            </div>

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
                : <>Criar conta <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
            Já tem conta?{' '}
            <a href="/login" style={{ color: '#7c3aed', fontWeight: '600', textDecoration: 'none' }}>
              Fazer login
            </a>
          </p>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '16px' }}>
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
              Comece a transformar a vida do seu condomínio hoje.
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
              Crie sua conta e tenha acesso a financeiro, comunicação, manutenção e muito mais, em um só lugar.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}