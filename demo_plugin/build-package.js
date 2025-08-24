#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { createWriteStream } from 'fs';
import archiver from 'archiver';

/**
 * Demo应用打包脚本
 * 
 * 功能：
 * 1. 清理之前的构建产物
 * 2. 执行应用构建
 * 3. 验证构建结果
 * 4. 创建标准应用包
 * 5. 生成gzip压缩包
 */

const PROJECT_ROOT = process.cwd();
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const PACKAGE_DIR = path.join(PROJECT_ROOT, 'packages');
const MANIFEST_FILE = path.join(PROJECT_ROOT, 'app.manifest.json');

// 从package.json读取应用信息
const packageJson = JSON.parse(await fs.readFile(path.join(PROJECT_ROOT, 'package.json'), 'utf-8'));
const APP_NAME = packageJson.name;
const APP_VERSION = packageJson.version;

console.log(`🚀 开始打包 ${APP_NAME} v${APP_VERSION}`);

/**
 * 清理目录
 */
async function cleanupDirectories() {
  console.log('🧹 清理构建目录...');
  
  try {
    await fs.rm(DIST_DIR, { recursive: true, force: true });
    console.log('✅ dist目录已清理');
  } catch (error) {
    console.log('ℹ️  dist目录不存在，跳过清理');
  }
  
  try {
    await fs.rm(PACKAGE_DIR, { recursive: true, force: true });
    console.log('✅ packages目录已清理');
  } catch (error) {
    console.log('ℹ️  packages目录不存在，跳过清理');
  }
  
  // 创建packages目录
  await fs.mkdir(PACKAGE_DIR, { recursive: true });
}

/**
 * 构建应用
 */
async function buildApplication() {
  console.log('🔨 构建应用...');
  
  try {
    execSync('npm run build', { 
      stdio: 'inherit',
      cwd: PROJECT_ROOT 
    });
    console.log('✅ 应用构建完成');
  } catch (error) {
    console.error('❌ 应用构建失败:', error.message);
    process.exit(1);
  }
}

/**
 * 验证构建结果
 */
async function validateBuildResult() {
  console.log('🔍 验证构建结果...');
  
  try {
    const stats = await fs.stat(DIST_DIR);
    if (!stats.isDirectory()) {
      throw new Error('dist目录不存在');
    }
    
    const indexPath = path.join(DIST_DIR, 'index.html');
    await fs.access(indexPath);
    
    console.log('✅ 构建结果验证通过');
  } catch (error) {
    console.error('❌ 构建结果验证失败:', error.message);
    process.exit(1);
  }
}

/**
 * 验证清单文件
 */
async function validateManifest() {
  console.log('📋 验证应用清单...');
  
  try {
    const manifestContent = await fs.readFile(MANIFEST_FILE, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    
    // 基本字段验证
    const requiredFields = ['manifest.id', 'manifest.name', 'manifest.displayName', 'manifest.version'];
    for (const field of requiredFields) {
      const keys = field.split('.');
      let obj = manifest;
      for (const key of keys) {
        if (!obj[key]) {
          throw new Error(`清单文件缺少必需字段: ${field}`);
        }
        obj = obj[key];
      }
    }
    
    console.log(`✅ 应用清单验证通过: ${manifest.manifest.displayName} v${manifest.manifest.version}`);
    return manifest;
  } catch (error) {
    console.error('❌ 应用清单验证失败:', error.message);
    process.exit(1);
  }
}

/**
 * 创建应用包
 */
async function createApplicationPackage(manifest) {
  console.log('📦 创建应用包...');
  
  const packageName = `${APP_NAME}-v${APP_VERSION}.zip`;
  const packagePath = path.join(PACKAGE_DIR, packageName);
  
  return new Promise((resolve, reject) => {
    const output = createWriteStream(packagePath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', () => {
      const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`✅ 应用包创建完成: ${packageName} (${sizeInMB}MB)`);
      resolve(packagePath);
    });

    archive.on('error', (err) => {
      console.error('❌ 创建应用包失败:', err);
      reject(err);
    });

    archive.pipe(output);

    // 添加应用清单
    archive.file(MANIFEST_FILE, { name: 'app.manifest.json' });
    
    // 添加构建产物
    archive.directory(DIST_DIR, 'dist');
    
    // 添加README（如果存在）
    const readmePath = path.join(PROJECT_ROOT, 'README.md');
    try {
      archive.file(readmePath, { name: 'README.md' });
    } catch (error) {
      console.log('ℹ️  README.md不存在，跳过');
    }
    
    // 添加变更日志（如果存在）
    const changelogPath = path.join(PROJECT_ROOT, 'CHANGELOG.md');
    try {
      archive.file(changelogPath, { name: 'CHANGELOG.md' });
    } catch (error) {
      console.log('ℹ️  CHANGELOG.md不存在，跳过');
    }

    archive.finalize();
  });
}

/**
 * 创建gzip压缩包
 */
async function createGzipPackage(zipPath) {
  console.log('🗜️  创建gzip压缩包...');
  
  const gzipName = `${APP_NAME}-v${APP_VERSION}.tar.gz`;
  const gzipPath = path.join(PACKAGE_DIR, gzipName);
  
  try {
    // 创建tar.gz包
    execSync(`tar -czf "${gzipPath}" -C "${PACKAGE_DIR}" "${path.basename(zipPath)}"`, {
      stdio: 'inherit'
    });
    
    const stats = await fs.stat(gzipPath);
    const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`✅ gzip压缩包创建完成: ${gzipName} (${sizeInMB}MB)`);
    
    return gzipPath;
  } catch (error) {
    console.error('❌ 创建gzip压缩包失败:', error.message);
    process.exit(1);
  }
}

/**
 * 显示打包结果
 */
async function showPackageInfo() {
  console.log('\n📊 打包结果:');
  
  try {
    const files = await fs.readdir(PACKAGE_DIR);
    const packageFiles = files.filter(f => f.startsWith(APP_NAME));
    
    for (const file of packageFiles) {
      const filePath = path.join(PACKAGE_DIR, file);
      const stats = await fs.stat(filePath);
      const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
      const relativePath = path.relative(PROJECT_ROOT, filePath);
      console.log(`  📄 ${relativePath} (${sizeInMB}MB)`);
    }
    
    console.log('\n🎉 打包完成！');
    console.log(`\n💡 使用方法:`);
    console.log(`   1. 开发环境测试: 上传 ${APP_NAME}-v${APP_VERSION}.zip 到主应用`);
    console.log(`   2. 生产环境部署: 使用 ${APP_NAME}-v${APP_VERSION}.tar.gz`);
    
  } catch (error) {
    console.error('❌ 显示打包信息失败:', error.message);
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    // 1. 清理目录
    await cleanupDirectories();
    
    // 2. 构建应用
    await buildApplication();
    
    // 3. 验证构建结果
    await validateBuildResult();
    
    // 4. 验证清单文件
    const manifest = await validateManifest();
    
    // 5. 创建应用包
    const zipPath = await createApplicationPackage(manifest);
    
    // 6. 创建gzip压缩包
    await createGzipPackage(zipPath);
    
    // 7. 显示结果
    await showPackageInfo();
    
  } catch (error) {
    console.error('❌ 打包过程失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main();