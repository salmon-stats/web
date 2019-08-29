<template>
  <div class="home">
    <div>
      <p>To upload results to this website, please use <a href="https://github.com/tkgstrator/Salmonia/releases">command-line result uploader</a>.</p>
    </div>

    <p>
      With contributions from <a href="https://twitter.com/tkgling">@tkgling</a> and <a href="https://twitter.com/barley_ural">@barley_ural</a>,
      developed &amp; run by <a href="https://twitter.com">@Yukinkling</a>.
    </p>

    <ul>
      <li v-for="schedule in schedules">{{ schedule }}</li>
    </ul>
  </div>
</template>
