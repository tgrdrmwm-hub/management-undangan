import { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  MapPin, 
  QrCode, 
  Phone, 
  Check, 
  Building 
} from 'lucide-react';
import { useWeddingData } from '../../../context/WeddingDataContext';
import { BankAccount, GiftAddressConfig } from '../../../types';

const BANK_OPTIONS: { id: BankAccount['logoType']; label: string }[] = [
  { id: 'bca', label: 'BCA (Bank Central Asia)' },
  { id: 'mandiri', label: 'Bank Mandiri' },
  { id: 'bri', label: 'BRI (Bank Rakyat Indonesia)' },
  { id: 'qris', label: 'QRIS / Digital Wallet (Semua Bank/E-Wallet)' },
];

export default function GiftTab() {
  const { data, updateData } = useWeddingData();
  const bankAccounts = data.bankAccounts || [];
  const giftAddress = data.giftAddress || {
    recipient: '',
    phone: '',
    address: '',
    note: '',
  };

  const handleUpdateAccounts = (newAccounts: BankAccount[]) => {
    updateData({ bankAccounts: newAccounts });
  };

  const handleAddAccount = () => {
    const newAcc: BankAccount = {
      id: 'bank-' + Date.now(),
      bankName: 'BCA (Bank Central Asia)',
      accountNumber: '1234567890',
      accountHolder: data.groom?.name?.toUpperCase() || 'NAMA MEMPELAI',
      logoType: 'bca',
    };
    handleUpdateAccounts([...bankAccounts, newAcc]);
  };

  const handleDeleteAccount = (index: number) => {
    if (confirm('Hapus rekening bank ini?')) {
      handleUpdateAccounts(bankAccounts.filter((_, i) => i !== index));
    }
  };

  const handleAccountChange = (index: number, field: keyof BankAccount, value: any) => {
    const updated = [...bankAccounts];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    handleUpdateAccounts(updated);
  };

  const handleAddressChange = (field: keyof GiftAddressConfig, value: string) => {
    updateData({
      giftAddress: {
        ...giftAddress,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-serif-luxury text-neutral-100">
            Amplop Digital & Kado Pernikahan (Tanda Kasih)
          </h3>
          <p className="text-xs text-neutral-400">
            Kelola nomor rekening bank transfer, barcode QRIS, serta alamat pengiriman kado fisik.
          </p>
        </div>

        <button
          onClick={handleAddAccount}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#dfb461] to-[#f4cf7b] text-neutral-950 text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rekening</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. BANK ACCOUNTS & QRIS */}
        <div className="space-y-4">
          <h4 className="font-bold text-neutral-200 text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#dfb461]" />
            <span>Daftar Rekening Bank & QRIS</span>
          </h4>

          {bankAccounts.map((acc, idx) => (
            <div
              key={acc.id || idx}
              className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-3 relative"
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-wider text-[#dfb461]">
                  Rekening #{idx + 1} ({acc.logoType.toUpperCase()})
                </span>
                {bankAccounts.length > 1 && (
                  <button
                    onClick={() => handleDeleteAccount(idx)}
                    className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                    title="Hapus Rekening"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Pilihan Bank / Tipe
                  </label>
                  <select
                    value={acc.logoType}
                    onChange={(e) => {
                      const logo = e.target.value as BankAccount['logoType'];
                      const matched = BANK_OPTIONS.find((b) => b.id === logo);
                      handleAccountChange(idx, 'logoType', logo);
                      if (matched) handleAccountChange(idx, 'bankName', matched.label);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  >
                    {BANK_OPTIONS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Nama Bank / Keterangan
                  </label>
                  <input
                    type="text"
                    value={acc.bankName}
                    onChange={(e) => handleAccountChange(idx, 'bankName', e.target.value)}
                    placeholder="Nama Bank"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Nomor Rekening / NMID
                  </label>
                  <input
                    type="text"
                    value={acc.accountNumber}
                    onChange={(e) => handleAccountChange(idx, 'accountNumber', e.target.value)}
                    placeholder="8735091244"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 font-mono focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Atas Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    value={acc.accountHolder}
                    onChange={(e) => handleAccountChange(idx, 'accountHolder', e.target.value)}
                    placeholder="ARYA PRATAMA"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 uppercase focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                {acc.logoType === 'qris' && (
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      URL Gambar Barcode QRIS (Opsional)
                    </label>
                    <input
                      type="url"
                      value={acc.qrisImageUrl || ''}
                      onChange={(e) => handleAccountChange(idx, 'qrisImageUrl', e.target.value)}
                      placeholder="Biarkan kosong untuk barcode QRIS digital otomatis"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 2. PHYSICAL GIFT ADDRESS */}
        <div className="space-y-4">
          <h4 className="font-bold text-neutral-200 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#dfb461]" />
            <span>Alamat Pengiriman Kado Fisik</span>
          </h4>

          <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Nama Penerima Paket / Kado
              </label>
              <input
                type="text"
                value={giftAddress.recipient}
                onChange={(e) => handleAddressChange('recipient', e.target.value)}
                placeholder="Arya Pratama & Anindya Larasati"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Nomor Telepon / WhatsApp Penerima
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={giftAddress.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  placeholder="0812-8899-7722"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                />
                <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Alamat Lengkap Rumah / Domisili
              </label>
              <textarea
                rows={3}
                value={giftAddress.address}
                onChange={(e) => handleAddressChange('address', e.target.value)}
                placeholder="Cluster Gardenia Hills Blok C-12, Jl. Kenanga Indah, Pondok Indah, Jakarta Selatan, DKI Jakarta 12310"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Catatan Pengiriman (Opsional)
              </label>
              <input
                type="text"
                value={giftAddress.note || ''}
                onChange={(e) => handleAddressChange('note', e.target.value)}
                placeholder="Konfirmasi pengiriman kado via WhatsApp terlebih dahulu..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
