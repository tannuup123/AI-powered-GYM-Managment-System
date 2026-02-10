import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        forgotPassword: resolve(__dirname, 'forgot-password.html'),
        ownerDashboard: resolve(__dirname, 'owner-dashboard.html'),
        memberDashboard: resolve(__dirname, 'member-dashboard.html'),
        trainerDashboard: resolve(__dirname, 'trainer-dashboard.html'),
        addMember: resolve(__dirname, 'add-member.html'),
        manageMembers: resolve(__dirname, 'manage-members.html'),
        createBill: resolve(__dirname, 'create-bill.html'),
        editProfile: resolve(__dirname, 'edit-profile.html'),
        viewReceipts: resolve(__dirname, 'view-receipts.html'),
        trainerSchedule: resolve(__dirname, 'trainer-schedule.html'),
        role: resolve(__dirname, 'role.html'),
        memberSignup: resolve(__dirname, 'member-signup.html'),
        trainerSignup: resolve(__dirname, 'trainer-signup.html'),
        ownerSignup: resolve(__dirname, 'owner-signup.html'),
        memberAi: resolve(__dirname, 'member-ai.html'),
        manageTrainers: resolve(__dirname, 'manage-trainers.html'),
        manageRequests: resolve(__dirname, 'manage-requests.html'),
        assignTrainer: resolve(__dirname, 'assign-trainer.html'),
        superadminDashboard: resolve(__dirname, 'superadmin-dashboard.html'),
        superadminLogin: resolve(__dirname, 'superadmin-login.html'),
        superadminUsers: resolve(__dirname, 'superadmin-users.html'),
        superadminGyms: resolve(__dirname, 'superadmin-gyms.html'),
        ownerAi: resolve(__dirname, 'owner-ai.html'),
        trainerAi: resolve(__dirname, 'trainer-ai.html'),
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
