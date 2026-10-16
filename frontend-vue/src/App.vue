<template>
  <div>
    <nav>
      <RouterLink to="/">Students</RouterLink>
      |
      <RouterLink to="/courses">Courses</RouterLink>
      |
      <RouterLink to="/enrollments">Enrollments</RouterLink>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>