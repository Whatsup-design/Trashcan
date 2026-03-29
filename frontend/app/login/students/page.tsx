'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { loginApi } from '@/lib/api'
import { saveSession, getRedirectPath } from '@/lib/auth'

import styles from './page.module.css'

export default function StudentLoginPage() {
  const router = useRouter()

  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await loginApi({
        loginId: studentId,
        password,
        rememberMe,
      })

      if (res.success && res.role) {
        saveSession(
          { role: res.role, token: res.token ?? '', username: studentId },
          rememberMe,
        )
        router.push(getRedirectPath(res.role))
      } else {
        setError(res.message ?? 'Invalid ID or password')
      }
    } catch {
      setError('Cannot connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/login" className={styles.back}>
          ← Back
        </Link>

        <div className={styles.header}>
          <img
            src="/kajonkietschool_Logo (1).png"
            alt="Student"
            width={24}
            style={{ margin: '4.5px' }}
            className={styles.headerIcon}
          />
          <div>
            <h1 className={styles.title}>Student & Staff</h1>
            <p className={styles.sub}>Sign in with your ID</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Student ID / Admin ID</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. 16001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrap}>
              <input
                className={styles.input}
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass((s) => !s)}
                tabIndex={-1}
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <label className={styles.rememberRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className={styles.rememberLabel}>Remember me</span>
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
