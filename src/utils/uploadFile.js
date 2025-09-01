// utils/uploadFile.js
export const uploadFileOnline = (options) => {
    return new Promise((resolve, reject) => {
      const {
        url,            // 服务器地址
        filePath,           // 要上传的文件对象
        name = 'file',  // 文件对应的 key
        formData = {},  // 额外的表单数据
        header = {},    // 请求头
        onProgressUpdate, // 进度回调
      } = options;
  
      if (!url) {
        reject(new Error('上传地址不能为空'));
        return;
      }
  
      if (!filePath) {
        reject(new Error('请选择要上传的文件'));
        return;
      }
  
      const xhr = new XMLHttpRequest();
      const form = new FormData();
  
      // 添加文件
      form.append(name, filePath);
  
      // 添加额外表单数据
      for (const key in formData) {
        form.append(key, formData[key]);
      }
  
      xhr.open('POST', url, true);
  
      // 设置请求头
      for (const key in header) {
        xhr.setRequestHeader(key, header[key]);
      }
  
      // 上传进度处理
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && typeof onProgressUpdate === 'function') {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgressUpdate({ progress });
        }
      };
  
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              statusCode: xhr.status,
              data: response,
              errMsg: 'uploadFile:ok'
            });
          } catch (e) {
            resolve({
              statusCode: xhr.status,
              data: xhr.responseText,
              errMsg: 'uploadFile:ok'
            });
          }
        } else {
          reject({
            statusCode: xhr.status,
            errMsg: `uploadFile:fail ${xhr.statusText}`
          });
        }
      };
  
      xhr.onerror = () => {
        reject({
          statusCode: 0,
          errMsg: 'uploadFile:fail network error'
        });
      };
  
      xhr.send(form);
    });
  };