import { createApp, h, defineComponent } from 'vue'
import JobConflictDialog from './JobConflictDialog.vue'

/**
 * Mở hộp thoại gộp và chờ người dùng quyết.
 *
 * Tự dựng lấy một instance Vue rời rồi gắn vào body — cùng kiểu Element Plus làm
 * với `$confirm`. Không cần đăng ký component, không phụ thuộc `ctx` là component
 * nào, và không thể gọi nhầm chỗ.
 *
 * @param {Array}  conflicts danh sách xung đột từ `mergeJob`; mỗi phần tử được
 *                           sửa TẠI CHỖ ở trường `choice` khi người dùng chọn
 * @param {string} jobName   tên job, để hiện trên tiêu đề
 * @returns {Promise<Array>} danh sách đã có `choice`; reject với Error('CANCELED')
 *                           nếu người dùng huỷ — `executeDownload` đã bắt sẵn mã
 *                           này và im lặng bỏ qua, không báo lỗi đỏ
 */
export function showJobConflictDialog(conflicts, jobName = '') {
  return new Promise((resolve, reject) => {
    const mount = document.createElement('div')
    document.body.appendChild(mount)

    let settled = false
    let app = null
    const cleanup = () => {
      // Chờ hết hoạt ảnh đóng của el-dialog rồi mới gỡ, không thì hộp thoại
      // biến mất giật cục.
      setTimeout(() => {
        if (app) {
          app.unmount()
          app = null
        }
        if (mount.parentNode) mount.parentNode.removeChild(mount)
      }, 300)
    }

    // `conflicts` phải đi qua `data` để Vue theo dõi được.
    //
    // Mảng này do `mergeJob` dựng bằng JavaScript thuần, ngoài tầm Vue. Truyền
    // thẳng vào `props` trong hàm render thì Vue KHÔNG biến nó thành reactive, nên
    // sửa `item.choice` không kéo theo lần vẽ lại nào. Hậu quả nhìn rất giống lỗi
    // radio: bấm chọn xong giao diện không đổi theo, và nút "Apply to all" bấm như
    // không. Đặt vào `data` là Vue duyệt sâu và theo dõi từng phần tử.
    const Root = defineComponent({
      data() {
        return { conflicts, jobName }
      },
      render() {
        return h(JobConflictDialog, {
          conflicts: this.conflicts,
          jobName: this.jobName,
          onResolve: (result) => {
            if (settled) return
            settled = true
            cleanup()
            resolve(result)
          },
          onCancel: () => {
            if (settled) return
            settled = true
            cleanup()
            reject(new Error('CANCELED'))
          }
        })
      }
    })

    app = createApp(Root)
    app.mount(mount)
  })
}
