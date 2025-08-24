#!/bin/bash

# Demo应用打包脚本 (Shell版本)
# 
# 功能：
# 1. 清理之前的构建产物
# 2. 执行应用构建
# 3. 创建标准应用包
# 4. 生成gzip压缩包

set -e  # 遇到错误时退出

# 颜色输出函数
print_info() {
    echo -e "\033[1;34m$1\033[0m"
}

print_success() {
    echo -e "\033[1;32m$1\033[0m"
}

print_error() {
    echo -e "\033[1;31m$1\033[0m"
}

print_warning() {
    echo -e "\033[1;33m$1\033[0m"
}

# 读取应用信息
APP_NAME=$(node -p "require('./package.json').name")
APP_VERSION=$(node -p "require('./package.json').version")

print_info "🚀 开始打包 $APP_NAME v$APP_VERSION"

# 项目根目录
PROJECT_ROOT=$(pwd)
DIST_DIR="$PROJECT_ROOT/dist"
PACKAGE_DIR="$PROJECT_ROOT/packages"
MANIFEST_FILE="$PROJECT_ROOT/app.manifest.json"

# 1. 清理目录
print_info "🧹 清理构建目录..."
rm -rf "$DIST_DIR"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"
print_success "✅ 目录清理完成"

# 2. 构建应用
print_info "🔨 构建应用..."
npm run build
print_success "✅ 应用构建完成"

# 3. 验证构建结果
print_info "🔍 验证构建结果..."
if [ ! -d "$DIST_DIR" ]; then
    print_error "❌ dist目录不存在"
    exit 1
fi

if [ ! -f "$DIST_DIR/index.html" ]; then
    print_error "❌ 缺少index.html文件"
    exit 1
fi
print_success "✅ 构建结果验证通过"

# 4. 验证清单文件
print_info "📋 验证应用清单..."
if [ ! -f "$MANIFEST_FILE" ]; then
    print_error "❌ 应用清单文件不存在: $MANIFEST_FILE"
    exit 1
fi

# 验证JSON格式
if ! node -e "JSON.parse(require('fs').readFileSync('$MANIFEST_FILE', 'utf8'))" 2>/dev/null; then
    print_error "❌ 应用清单JSON格式错误"
    exit 1
fi
print_success "✅ 应用清单验证通过"

# 5. 创建临时打包目录
TEMP_DIR="$PACKAGE_DIR/temp-$APP_NAME"
mkdir -p "$TEMP_DIR"

# 复制文件到临时目录
cp "$MANIFEST_FILE" "$TEMP_DIR/"
cp -r "$DIST_DIR" "$TEMP_DIR/"

# 复制可选文件
if [ -f "README.md" ]; then
    cp "README.md" "$TEMP_DIR/"
else
    print_warning "ℹ️  README.md不存在，跳过"
fi

if [ -f "CHANGELOG.md" ]; then
    cp "CHANGELOG.md" "$TEMP_DIR/"
else
    print_warning "ℹ️  CHANGELOG.md不存在，跳过"
fi

# 6. 创建ZIP包
print_info "📦 创建应用包..."
ZIP_NAME="${APP_NAME}-v${APP_VERSION}.zip"
ZIP_PATH="$PACKAGE_DIR/$ZIP_NAME"

cd "$TEMP_DIR"
zip -r "$ZIP_PATH" . -q
cd "$PROJECT_ROOT"

ZIP_SIZE=$(du -h "$ZIP_PATH" | cut -f1)
print_success "✅ ZIP包创建完成: $ZIP_NAME ($ZIP_SIZE)"

# 7. 创建tar.gz包
print_info "🗜️  创建gzip压缩包..."
GZIP_NAME="${APP_NAME}-v${APP_VERSION}.tar.gz"
GZIP_PATH="$PACKAGE_DIR/$GZIP_NAME"

cd "$TEMP_DIR"
tar -czf "$GZIP_PATH" . 
cd "$PROJECT_ROOT"

GZIP_SIZE=$(du -h "$GZIP_PATH" | cut -f1)
print_success "✅ gzip压缩包创建完成: $GZIP_NAME ($GZIP_SIZE)"

# 8. 清理临时目录
rm -rf "$TEMP_DIR"

# 9. 显示打包结果
print_info "📊 打包结果:"
echo "  📄 packages/$ZIP_NAME ($ZIP_SIZE)"
echo "  📄 packages/$GZIP_NAME ($GZIP_SIZE)"

print_success "🎉 打包完成！"
echo ""
print_info "💡 使用方法:"
echo "   1. 开发环境测试: 上传 $ZIP_NAME 到主应用"
echo "   2. 生产环境部署: 使用 $GZIP_NAME"
echo ""
print_info "📍 打包文件位置: $PACKAGE_DIR"