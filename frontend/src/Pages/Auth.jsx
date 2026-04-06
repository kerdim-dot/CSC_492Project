export function getRole() {
  return localStorage.getItem("role") || "user";
}

export function getPermissions(role) {
  const ROLE_PERMISSIONS = {
    user: {
      canAssignStudents: false,
      canAlterClasses: false,
      canManageAdmins: false,
    },
    admin: {
      canAssignStudents: true,
      canAlterClasses: true,
      canManageAdmins: false,
    },
    supervisor: {
      canAssignStudents: true,
      canAlterClasses: true,
      canManageAdmins: true,
    },
  };

  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.user;
}