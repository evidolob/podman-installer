<script lang="ts">
  import './app.css';
  import '@patternfly/patternfly/patternfly.css';
  import '@patternfly/patternfly/patternfly-addons.css';
  import '@patternfly/patternfly/patternfly-theme-dark.css';
  import './override.css';
  import Logo from './lib/logo/Logo.svelte';
</script>

<main class="min-h-screen flex flex-col h-screen bg-purple-500">
  <header id="navbar" class="text-gray-400 bg-zinc-900 body-font" style="-webkit-app-region: drag;">
    <div class="container flex mx-auto flex-col p-2 items-center">
      <div class="flex lg:w-1/5 flex-wrap items-center text-base ml-auto"></div>
      <div
        class="flex order-none title-font font-medium items-center text-white align-middle justify-center mb-4 md:mb-0">
        <Logo />
        <span class="ml-3 text-xl block text-gray-300">Podman Installer</span>
      </div>
      <div class="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0"></div>
    </div>
  </header>

  <div class="overflow-x-hidden flex flex-1">
    <nav
    class="pf-c-nav z-0 group bg-purple-700 w-12 md:w-52 hover:w-52  shadow  flex-col justify-between sm:flex transition-all duration-500 ease-in-out"
    aria-label="Global">
      <ul class="pf-c-nav__list">
        <li class="pf-c-nav__item flex w-full justify-between hover:text-gray-300 dark:text-white pf-m-current cursor-pointer items-center mb-6">
            <span class="md:block group-hover:block mr-5">Welcome</span>
        </li>
      </ul>
    </nav>
  </div>
</main>
