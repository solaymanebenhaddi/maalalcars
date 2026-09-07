'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
} from 'lucide-react'

export default function NotificationSettingsPage() {
  const [inApp, setInApp] = useState(true)
  const [email, setEmail] = useState(true)
  const [sms, setSms] = useState(false)
  const [push, setPush] = useState(true)

  const [groupDaily, setGroupDaily] = useState(true)
  const [sound, setSound] = useState(true)
  const [badge, setBadge] = useState(true)

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/notifications"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux notifications</span>
        </Link>
      </div>

      {/* Main Container matching Reference #20 Screen 17C */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
            Préférences de notification
          </h1>
          <p className="text-xs text-zinc-400">
            Personnalisez vos préférences de réception des notifications.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Canaux</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Catégories</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Horaires</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Avancées</button>
        </div>

        {/* 2 Configuration Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Canaux de notification */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Canaux de notification
            </h3>

            <div className="space-y-3 text-[11px]">
              {/* In-app */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121216] border border-[#22222c]">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Notifications in-app</div>
                    <div className="text-[10px] text-zinc-400">Recevoir les notifications dans l&apos;application</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInApp(!inApp)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    inApp ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      inApp ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121216] border border-[#22222c]">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Email</div>
                    <div className="text-[10px] text-zinc-400">Recevoir les notifications par email</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEmail(!email)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    email ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      email ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* SMS */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121216] border border-[#22222c]">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">SMS</div>
                    <div className="text-[10px] text-zinc-400">Recevoir les notifications par SMS</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSms(!sms)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    sms ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      sms ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Push Mobile */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121216] border border-[#22222c]">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Push mobile</div>
                    <div className="text-[10px] text-zinc-400">Recevoir les notifications push sur mobile</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPush(!push)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    push ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      push ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Paramètres généraux */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Paramètres généraux
            </h3>

            <div className="space-y-3 text-[11px]">
              {/* Regrouper les notifications */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121216] border border-[#22222c]">
                <div>
                  <div className="font-bold text-white">Regrouper les notifications</div>
                  <div className="text-[10px] text-zinc-400">Recevoir un résumé quotidien</div>
                </div>

                <button
                  type="button"
                  onClick={() => setGroupDaily(!groupDaily)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    groupDaily ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      groupDaily ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Son de notification */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121216] border border-[#22222c]">
                <div>
                  <div className="font-bold text-white">Son de notification</div>
                  <div className="text-[10px] text-zinc-400">Activer les sons d&apos;alerte</div>
                </div>

                <button
                  type="button"
                  onClick={() => setSound(!sound)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    sound ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      sound ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Badge compteur */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121216] border border-[#22222c]">
                <div>
                  <div className="font-bold text-white">Badge compteur</div>
                  <div className="text-[10px] text-zinc-400">Afficher le nombre de notifications non lues</div>
                </div>

                <button
                  type="button"
                  onClick={() => setBadge(!badge)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    badge ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      badge ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="flex justify-end pt-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            <Save className="h-3.5 w-3.5" />
            <span>Enregistrer les préférences</span>
          </button>
        </div>
      </div>
    </div>
  )
}
