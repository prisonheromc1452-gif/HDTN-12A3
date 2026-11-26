# 🎵 GUESS THE SONG – ĐOÁN TÊN BÀI HÁT

Website mini-game âm nhạc phong cách **Modern Dark UI**, cho phép người chơi nghe đoạn nhạc mở đầu, suy nghĩ đoán tên bài hát, mở đáp án kèm hiệu ứng và tiếp tục thưởng thức phần còn lại của bài hát. Dự án được tối ưu thuần HTML/CSS/JavaScript tĩnh, không cần backend hay cơ sở dữ liệu, sẵn sàng triển khai công khai miễn phí trên **GitHub Pages**.

---

## ✨ Chức năng chính

- **Phát đoạn nhạc đoán bài:** Tự động phát 10s, 12s (mặc định) hoặc 15s đầu tiên rồi tự dừng và hiển thị thông báo *"HẾT THỜI GIAN NGHE – BẠN ĐOÁN ĐƯỢC CHƯA?"*.
- **Hiện đáp án & Nghe tiếp:** Mở tên bài hát (và ca sĩ) kèm hiệu ứng mượt mà; bấm **NGHE TIẾP** để phát tiếp từ đúng vị trí đã dừng cho đến hết video.
- **Chuyển bài sạch sẽ:** Ngắt hoàn toàn âm thanh và luồng phát của bài cũ trước khi tải bài mới, không bao giờ bị phát chồng tiếng.
- **Chế độ Chỉ nghe nhạc (Audio Only):** Ẩn khung hình video (chống lộ chữ/tiêu đề trên video) và hiển thị đĩa than xoay + sóng âm neon.
- **Tùy chỉnh linh hoạt:** Chọn thời gian nghe (10s / 12s / 15s), xáo trộn thứ tự bài hát, theo dõi tiến độ hoàn thành, chơi lại từ đầu.
- **Trình chỉnh sửa đáp án nhanh:** Điền tên bài hát ngay trên giao diện và xuất ra file `songs.json` chuẩn để cập nhật lên GitHub.
- **Hỗ trợ phím tắt & Responsive:** Chơi mượt trên máy tính, laptop và điện thoại (`Space`: Bắt đầu / Nghe tiếp, `R`: Hiện đáp án, `N`: Bài tiếp theo).

---

## 📁 Cấu trúc thư mục

```text
guess-the-song/
├── index.html          # Trang web chính (bắt buộc nằm ở thư mục gốc repository)
├── style.css           # Giao diện Modern Dark UI & Responsive
├── script.js           # Toàn bộ logic trò chơi và điều khiển video
├── songs.json          # Danh sách bài hát, đường dẫn video và đáp án
├── README.md           # Tài liệu hướng dẫn sử dụng & triển khai
└── videos/             # Thư mục chứa toàn bộ 9 video bài hát (chuẩn H.264/AAC)
    ├── song_01.mp4
    ├── song_02.mp4
    ├── song_03.mp4
    ├── song_04.mp4
    ├── song_05.mp4
    ├── song_06.mp4
    ├── song_07.mp4
    ├── song_08.mp4
    └── song_09.mp4
```

---

## 💻 Hướng dẫn chạy thử trên máy tính

1. Giải nén file ZIP để lấy thư mục `guess-the-song`.
2. **Cách nhanh nhất:** Mở thư mục `guess-the-song` và nhấp đúp vào file `index.html` để mở bằng **Google Chrome** (hoặc Edge/Safari).
3. **Cách khuyến nghị (khi muốn kiểm tra thay đổi từ `songs.json`):** Mở thư mục bằng **VS Code**, cài tiện ích **Live Server**, nhấp chuột phải vào `index.html` và chọn **Open with Live Server**.

---

## 🚀 Hướng dẫn upload lên GitHub (Dành cho người mới)

### Bước 1: Tạo Repository mới trên GitHub
1. Đăng nhập vào [https://github.com](https://github.com).
2. Nhấn nút **`+`** ở góc trên bên phải → chọn **New repository**.
3. Nhập tên repository ở ô **Repository name**, ví dụ: `guess-the-song`.
4. Chọn chế độ **Public** (bắt buộc đối với tài khoản GitHub miễn phí để bật GitHub Pages).
5. Nhấn nút màu xanh **Create repository**.

### Bước 2: Tải toàn bộ file dự án lên Repository
> ⚠️ **Lưu ý cực kỳ quan trọng:** Hãy upload các file **nằm bên trong** thư mục `guess-the-song` (để `index.html` nằm trực tiếp ở thư mục gốc của repository, **không** upload cả thư mục vỏ bọc `guess-the-song/`).

1. Trong trang repository vừa tạo, nhấn dòng chữ **uploading an existing file** (hoặc nút **Add file** → **Upload files**).
2. Mở thư mục `guess-the-song` trên máy tính, bôi đen toàn bộ 6 mục bên trong (`index.html`, `style.css`, `script.js`, `songs.json`, `README.md` và thư mục `videos`).
3. Kéo thả toàn bộ vào khung upload trên trình duyệt GitHub và chờ thanh tiến trình tải xong cả 9 video.
4. Kéo xuống dưới, nhấn nút **Commit changes**.

*(Mẹo: Nếu mạng chậm khiến giao diện web GitHub tải nhiều file video bị ngắt, bạn có thể upload 5 file gốc trước, sau đó tạo/upload thư mục `videos` hoặc chia nhỏ mỗi lần 3–4 video, hoặc dùng ứng dụng **GitHub Desktop** để đẩy lên trong 1 lần).*

---

## 🌐 Hướng dẫn bật GitHub Pages để lấy link chia sẻ

1. Trong repository trên GitHub, chọn tab **Settings** (thanh menu phía trên).
2. Ở cột menu bên trái, chọn **Pages**.
3. Trong mục **Build and deployment**:
   - **Source:** chọn **Deploy from a branch**.
   - **Branch:** chọn nhánh **`main`** (hoặc `master`), thư mục chọn **`/ (root)`** → nhấn **Save**.
4. Chờ khoảng **1–2 phút** rồi tải lại trang (F5). Đường link công khai của website sẽ xuất hiện ở đầu mục Pages theo dạng:
   ```text
   https://<ten-tai-khoan-github>.github.io/guess-the-song/
   ```
5. Gửi đường link này cho bạn bè — bất kỳ ai có điện thoại hoặc máy tính đều có thể mở và chơi ngay lập tức!

---

## ✏️ Hướng dẫn cập nhật tên bài hát hoặc thêm bài hát mới

### 1. Cập nhật đáp án tên bài hát cho 9 video hiện có
Có **2 cách** rất đơn giản:

- **Cách 1 (Sửa trực tiếp trên GitHub):**
  1. Mở file `songs.json` trong repository GitHub → nhấn biểu tượng cây bút (**Edit this file**).
  2. Thay đổi nội dung trường `"title"` (tên bài hát) và `"artist"` (ca sĩ, tùy chọn) tương ứng từng video `videos/song_01.mp4` ... `videos/song_09.mp4`.
  3. Nhấn **Commit changes**. Chờ khoảng 1 phút là web tự cập nhật cho tất cả mọi người.

- **Cách 2 (Dùng trình chỉnh sửa ngay trên website):**
  1. Mở website → nhấn **`⚙️ Cài đặt`** → **`✏️ Sửa tên bài hát`**.
  2. Điền tên bài hát và ca sĩ cho từng bài → nhấn **`💾 Tải file songs.json`**.
  3. Upload file `songs.json` vừa tải lên repository GitHub để ghi đè file cũ.

### 2. Thêm bài hát mới (ví dụ bài số 10)
1. Đặt tên video mới theo quy tắc không dấu, không khoảng trắng: `song_10.mp4`.
2. Tải `song_10.mp4` vào bên trong thư mục `videos/` trên GitHub.
3. Mở file `songs.json` và thêm một mục mới vào cuối danh sách (nhớ thêm dấu phẩy `,` sau mục thứ 9):
   ```json
   {
     "id": 10,
     "file": "videos/song_10.mp4",
     "title": "Tên bài hát số 10",
     "artist": "Tên ca sĩ"
   }
   ```
4. Lưu (**Commit changes**) là xong — website tự động cập nhật tổng số bài thành `SONG 01 / 10`.

---

## ⚠️ Lưu ý về dung lượng video và đường dẫn

- **Giới hạn dung lượng của GitHub:**
  - Upload qua giao diện web GitHub: tối đa **25 MB / mỗi file**.
  - Đẩy qua Git / GitHub Desktop: tối đa **100 MB / mỗi file** (cảnh báo từ 50 MB).
  - Tổng dung lượng khuyến nghị cho GitHub Pages: dưới **1 GB**.
  - Hiện tại toàn bộ 9 video của dự án chỉ chiếm **28,17 MB** (file lớn nhất là `song_04.mp4` chỉ **7,56 MB**), hoàn toàn đạt chuẩn upload trực tiếp lên GitHub.
- **Định dạng video tương thích tốt nhất:** Nên dùng `.mp4` (codec hình ảnh **H.264**, âm thanh **AAC**) để chạy mượt trên Chrome, Safari (iPhone/Mac), Edge và Firefox.
- **Quy tắc đặt tên & đường dẫn:** Luôn dùng chữ thường, không dấu, không khoảng trắng (ví dụ `videos/song_10.mp4`), phân biệt chữ HOA/thường vì máy chủ GitHub Pages chạy Linux (nên `Song_01.MP4` sẽ khác `song_01.mp4`).
