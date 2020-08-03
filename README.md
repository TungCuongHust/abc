## Benchmark server

### Chạy chương trình Benchmark

* Vào thư mục Benchmark . Ở trong thư mục hiện tại, có 3 file chạy của chương trình:

* Benchmark-linux : file để chạy trên linux

* Benchmark-macos: file để chạy trên macos

* Bechmark-win. exe: file để chạy trên windows

Tùy vào môi trường server ta sẽ chạy file tương ứng. 

#### Đối với linux: 

Lệnh sẽ như sau

``` 
./Benchmark-linux --mode= --ffmpeg= --inputFile= --encoder= --preset= --output= --numberDevice=
```

Chú ý: 6 argument đầu tiên là bắt buộc, phải truyền đủ 6 argument đầu tiên

Trong đó: 

* --mode: tham số truyền vào tương ứng với chế độ benchmark trên cpu hay gpu (bắt buộc)

* --ffmpeg: tham số truyền vào tương ứng với đường dẫn tới ffmpeg (bắt buộc)

* --inputFile: tham số truyền vào thứ 3 tương ứng với file đầu vào để tạo luồng udp cho input (bắt buộc)

* --encoder: tham số truyền vào tương ứng với bộ mã hóa (encoder) sử dụng là gì. Ví dụ: libx264 với cpu, h264_nvenc với gpu. (bắt buộc)

* --preset: tham số  truyền vào tương ứng với preset transcode là gì. Với ffmpeg transcode trên gpu preset là: ll, llhq , llhp. Còn với ffmpeg transcode trên cpu preset là: medium, veryfast, superfast. (bắt buộc)

* --output: tham số  truyền vào tương ứng với luồng udp output là gì. (bắt buộc)

* --numberDevice: tham số truyền vào sử dụng cho benchmark GPU tương ứng với việc lựa chọn card gpu nào để thực hiện transcode trên gpu 

Ví dụ:

Đối với CPU:

``` 
./Benchmark-linux --mode=cpu --ffmpeg=./ffmpeg --inputFile=input1080.mp4 --encoder=libx264 --preset=superfast --output=udp://224.0.0.1:7777
```

Đối với GPU:

##### Chú ý: sử dụng địa chỉ udp từ 224 trở lên mới có thể chia sẻ cho chương trình khác. 

``` 
./Benchmark-linux --mode=gpu --ffmpeg=./ffmpeg --inputFile=input1080.mp4 --encoder=h264_nvenc --preset=ll --output=udp://224.0.0.1:7777 --numberDevice=3
```

-Kết quả sẽ hiện ra như sau:
(Đối với CPU)

``` 
Number_threads_1080p_big=7
Result_capacity_unit_big=320
Result_capacity_unit_normal=280
Result_capacity_unit_small=93
Result_average_capacity_all_unit=231
```

(Đối với GPU)

``` 
Number_threads_1080p_big=7
Result_capacity_unit_big=320
Result_capacity_unit_normal=280
Result_capacity_unit_small=93
Result_average_capacity_all_unit=231
```

Bảng mapping đơn vị tương ứng với CPU và GPU

| Giá trị      | CPU             | GPU             |
| ------------ |:-------------:  | :-------------: |     
| Big          |  Superfast      |  llhq           |
| Normal       | Veryfast        | ll              |
| Small        | Medium          | llhp            |

* Chú thích: 

| Giá trị                              | Ý nghĩa                |
| -------------                        |:-------------:         |      
| Number_threads_1080p_big        | Số  thread 1080p tối đa mà máy có thể chạy được với preset là superfast       (đối Với CPU) hoặc với preset là llhq       (đối Với GPU)           |
| Number_threads_1080p_normal        | Số  thread 1080p tối đa mà máy có thể chạy được với preset là veryfast (với CPU) hoặc với preset là ll (đối Với GPU)            |
| Number_threads_1080p_small        | Số  thread 1080p tối đa mà máy có thể chạy được với preset medium (đối với CPU) hoặc với preset là llhp  (đối Với GPU)                 |
| Result_capacity_unit_big       | Số đơn vị của máy với preset là superfast (đối với CPU) hoặc với preset là llhq (với GPU)               |   
| Result_capacity_unit_normal              | Số đơn vị của máy với preset là ll      ( đối Với GPU)           | 
| Result_capacity_unit_small        | Số đơn vị của máy với preset là medium (đối với CPU) hoặc với preset là llhp   (đối Với GPU)              |
| Result_average_capacity_all_unit        | Số capacity trung bình của tất cả các đơn vị capacity               |
   

#### Luật kiểm tra năng lực:

* Sử dụng luồng 1080p để kiểm tra
* Tăng dần số process lên bắt đầu từ 1
* Cứ sau 30s thì thêm 1 process
* Nếu CPU sử dụng >0. 7 thì thực hiện dừng chương trình và trả về kết quả. 
* Và cứ sau 25s kể từ khi thêm một process thì kiểm tra độ ổn định của tất cả các process. Nếu bất kỳ process nào có speed < 0. 97 thì sẽ lấy số process trước đó. Đồng thời dừng chương trình. 

#### Ngoài ra đối với các nền tảng khác như windows hay MacOS thì cũng thực hiện tương tự và kết quả cũng như vậy. 



Number_threads_1080p_normal=14
Result_capacity_unit_big=635
Result_capacity_unit_normal=600
Result_capacity_unit_small=564
Result_average_capacity_all_unit=599
