import { create } from 'zustand';

// 这个 store 用来管理跨组件共享的全局状态
const useAppStore = create((set) => ({
  // 用户当前正在查看或者操作的车辆 ID
  currentVehicleId: null,
  
  // 设置当前选中车辆
  setCurrentVehicle: (vehicleId) => set({ currentVehicleId: vehicleId }),
  
  // 可以添加更多状态
  // userProfile: null,
  // setUserProfile: (profile) => set({ userProfile: profile }),
}));

export default useAppStore;
