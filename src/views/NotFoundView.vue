<template>
  <main class="not-found-page">
    <RouterLink class="brand not-found-brand" to="/">
      <span class="brand-mark"><i class="bi bi-journal-bookmark-fill" /></span>
      <span class="brand-name">Nhớ</span>
    </RouterLink>
    <div class="not-found-code">404</div>
    <div class="not-found-icon"><i class="bi bi-file-earmark-x" /></div>
    <h1>Trang này không tồn tại</h1>
    <p>Có vẻ đường dẫn bạn vừa mở đã bị thay đổi hoặc chưa từng tồn tại.</p>
    <RouterLink class="btn btn-primary" to="/"><i class="bi bi-house-door" /> Về trang tổng quan</RouterLink>
  </main>
</template>
