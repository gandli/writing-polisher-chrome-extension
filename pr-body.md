## Summary

移植 shibing624/pycorrector 中文纠错到纯浏览器端 Chrome 扩展

### Changes

- ✅ 增加 `jieba-js` 中文分词
- ✅ 增加 `onnxruntime-web` ONNX 模型浏览器推理
- ✅ 封装 `chinese-corrector.ts` 调用 pycorrector 预训练 ONNX 模型
- ✅ 精简项目，移除原有口语转换/法条功能，专注中文拼写纠错
- ✅ 设置页面支持配置模型和词表 URL
- ✅ 自动检测页面 editable 区域，红色波浪下划线高亮错误，点击一键替换
- ✅ **完全离线**：模型下载后不需要任何后端服务，文字永不离开浏览器

### 默认模型
- 模型: `https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx/resolve/main/model.onnx`
- 词表: `https://huggingface.co/shibing624/mengzi-t5-base-chinese-correction-onnx/resolve/main/vocab.txt`

基于 pycorrector 项目的预训练模型，完全浏览器端运行。
