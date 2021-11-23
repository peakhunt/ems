const ErrorCodes = require('./ErrorCodes');
const Capabilities = require('./Capabilities');

export default {
  en: {
    Yes: 'Yes',
    No: 'No',
    Cancel: 'Cancel',
    Confirm: 'Confirm',
    test1: 'LATEST RELEASE',
    loggingOut: 'Logging Out',
    forcedLogout: 'You are logged out by the server',
    initializing: 'Initializing EMS Client...',
    login: {
      name: 'Login',
      str1: 'Login',
      str2: 'User Name',
      str3: 'Password',
      str4: 'Login',
    },
    dashboard: {
      name: 'Dashboard',
    },
    userMgmt: {
      name: 'User Management',
      title: 'User List',
      reload: 'Reload',
      addNewUser: 'Add New User',
      username: 'User Name',
      adminRole: 'Admin Privilege',
      addSuccess: 'Successfully added a new user',
      delSuccess: 'Successfully deleted the user account',
      updatePassSuccess: 'Successfully updated the user\'s password',
      updateCapSuccess: 'Successfully updated the user\'s capabilities',
      addingNewUser: 'Adding New User',
      updatingPassword: 'Updating password',
      updatingCapabilities: 'Updating capabilities',
      deletingAccount: 'Deleting user account',
      retrievingAccounts: 'Retrieving All users from Database',
      retrieveAccountsFailed: 'Failed to retrieve users data from database',
    },
    about: {
      name: 'About',
    },
    userProfile: {
      name: 'User Profile',
      orgPass: 'Original Password',
      newPass1: 'New Password',
      newPass2: 'New Password Again',
      changePassDesc: 'You can change your password',
      changePass: 'Change Password',
      changeCap: 'Change Capabilities',
      err1: 'Please enter original password',
      err2: 'Please enter new password',
      err3: 'Password doesn\'t match',
      changePassSuccess: 'Successfully changed password',
      updatingPassword: 'Updating password',
    },
    settings: {
      name: 'Settings',
      lang: 'Language',
      langSelTitle: 'System Language',
    },
    UserManagementDialog: {
      title: 'Add New User',
      userInfo: 'User Info',
      usernameLabel: 'Username',
      addNewUser: 'Add New User',
      editUserTitle: 'Edit User Account',
      deleteTxt: 'Delete User Account',
      passwordTitle: 'Password',
      changePassword: 'Change Password',
      adminWarning: 'You can\'t change Admin password here!',
      adminWarning2: 'You can\'t change Admin capabilities!',
      capabilitiesTitle: 'Capabilities',
      changeCapabilities: 'Update Capabilities',
      deleteConfirm: 'Are you sure you want to delete this user account?',
    },
    logout: 'Logout',
    errors: {
      [ErrorCodes.ErrorNetwork]: 'Network error',
      [ErrorCodes.ErrorProtocol]: 'Protocol error',
      [ErrorCodes.ErrorDatabase]: 'Database access error',
      [ErrorCodes.ErrorLoginIDPassword]: 'Username/Password mismatch',
      [ErrorCodes.ErrorUserAlreadyExist]: 'Username is already in use',
      [ErrorCodes.ErrorPrivilege]: 'Privilege error!',
    },
    caps: {
      name: 'Capabilities',
      [Capabilities.CapUserManagement]: 'User Management',
      [Capabilities.CapTest1]: 'Test1',
      [Capabilities.CapTest2]: 'Test2',
      [Capabilities.CapTest3]: 'Test3',
    },
  },
  kr: {
    Yes: '예',
    No: '아니오',
    Cancel: '취소',
    Confirm: '확인',
    test1: '최신 릴리스',
    loggingOut: '로그아웃...',
    forcedLogout: '서버에 의해 강제 로그아웃 됐습니다',
    initializing: 'EMS 클리이언트 초기화...',
    login: {
      name: '로그인',
      str1: '로그인',
      str2: '아이디',
      str3: '비밀번호',
      str4: '로그인',
    },
    dashboard: {
      name: '대시보드',
    },
    userMgmt: {
      name: '사용자 관리',
      title: '사용자 목록',
      reload: '다시 불러들이기',
      addNewUser: '새로운 사용자 등록',
      username: '사용자 아이디',
      adminRole: '관리자 계정',
      addSuccess: '새로운 사용자를 추가 하였습니다',
      delSuccess: '해당 사용자를 삭제 하였습니다',
      updatePassSuccess: '해당 사용자의 패스워드를 변경 하였습니다',
      updateCapSuccess: '해당 사용자의 권한을 변경 하였습니다',
      addingNewUser: '새로운 사용자 추가 중',
      updatingPassword: '비밀번호를 변경 하는 중',
      updatingCapabilities: '권한을 변경 하는 중',
      deletingAccount: '계정을 삭제 하는 중',
      retrievingAccounts: ' 모든 사용자 계정을 로드 중',
      retrieveAccountsFailed: '모든 사용자 계정을 로드 하는데 실패하였습니다',
    },
    userProfile: {
      name: '사용자 정보',
      orgPass: '기존 비밀번호',
      newPass1: '새로운 비밀번호',
      newPass2: '새로운 비빌번호 재 입력',
      changePassDesc: '비밀번호를 변경 할 수 있습니다',
      changePass: '비밀번호 변경',
      changeCap: '사용자 권한 변경',
      err1: '기존 비밀번호를 입력해 주십시오',
      err2: '새로운 비밀번호를 입력해 주십시오',
      err3: '새로운 비밀번호가 맞지 않습니다',
      changePassSuccess: '비밀번호를 변경하였습니다',
      updatingPassword: '비밀번호를 변경 하는 중',
    },
    settings: {
      name: '설정',
      lang: '언어',
      langSelTitle: '시스템 언어',
    },
    about: {
      name: 'S/W 정보',
    },
    UserManagementDialog: {
      title: '새로운 사용자 등록',
      userInfo: '사용자 정보',
      usernameLabel: '사용자 아이디',
      addNewUser: '사용자 등록',
      editUserTitle: '사용자 계정 수정',
      deleteTxt: '계정 삭제',
      passwordTitle: '비밀번호',
      changePassword: '비밀번호 변경',
      adminWarning: '관리자 비밀번호는 여기서 변경할 수 없습니다!',
      adminWarning2: '관리자 계정은 권한은 변경할 수 없습니다!',
      capabilitiesTitle: '권한',
      changeCapabilities: '권한 변경',
      deleteConfirm: '정말 해당 사용자 계정을 삭제 하시겠습니까?',
    },
    logout: '로그아웃',
    errors: {
      [ErrorCodes.ErrorNetwork]: '네트워크 에러',
      [ErrorCodes.ErrorProtocol]: '프로토콜 에러',
      [ErrorCodes.ErrorDatabase]: '데이타베이스 접속 장애',
      [ErrorCodes.ErrorLoginIDPassword]: '아이디/비밀번호가 맞지 않음',
      [ErrorCodes.ErrorUserAlreadyExist]: '아이디가 이미 사용중',
      [ErrorCodes.ErrorPrivilege]: '해당 작업 권한이 없음',
    },
    caps: {
      name: '사용자 권한',
      [Capabilities.CapUserManagement]: '사용자 관리',
      [Capabilities.CapTest1]: '테스트1',
      [Capabilities.CapTest2]: '테스트2',
      [Capabilities.CapTest3]: '트스트3',
    },
  },
};
