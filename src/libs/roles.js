export const ROLES = {
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
  TUTOR: 'TUTOR',
  ADMIN: 'ADMIN',
}

export function getAllowedRoles(pathname) {
  if (pathname.startsWith('/dashboards/parent-')) return [ROLES.PARENT]
  if (pathname.startsWith('/dashboards/student-')) return [ROLES.STUDENT]
  if (pathname.startsWith('/dashboards/tutor-')) return [ROLES.TUTOR]
  if (pathname.startsWith('/dashboards/instructor-')) return [ROLES.TUTOR]
  if (pathname.startsWith('/dashboards/admin-')) return [ROLES.ADMIN]
  if (pathname.startsWith('/parent-requirements/')) return [ROLES.PARENT, ROLES.TUTOR, ROLES.STUDENT]

  if (pathname === '/parent-profile') return [ROLES.PARENT]
  if (pathname === '/student-profile') return [ROLES.STUDENT]
  if (pathname === '/instructor-profile') return [ROLES.TUTOR]
  if (pathname === '/tutor-registration') return [ROLES.TUTOR]
  if (pathname === '/wallet') return [ROLES.TUTOR]
  if (pathname === '/create-requirement') return [ROLES.PARENT, ROLES.STUDENT]
  if (pathname === '/dashboards/create-requirement') return [ROLES.PARENT, ROLES.STUDENT]
  if (pathname === '/dashboards/create-course') return [ROLES.TUTOR]
  if (pathname === '/dashboards/wallet') return [ROLES.TUTOR]
  if (pathname === '/dashboards/become-an-instructor') return [ROLES.PARENT, ROLES.STUDENT, ROLES.TUTOR]

  if (pathname.startsWith('/dashboards/')) return Object.values(ROLES)

  return null
}
