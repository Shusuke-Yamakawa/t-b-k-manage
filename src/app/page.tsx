'use client';

export default function HomePage() {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
  return (
    <>
      <div>ログイン画面に飛ばす</div>
    </>
  );
}
