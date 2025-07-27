import os
import re
import shutil


def rename_files(path):
    # 设置输出目录路径
    output_dir = os.path.join(path, "outputs")

    # 如果输出目录已存在，先删除整个目录及其内容
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)

    # 重新创建输出目录
    os.makedirs(output_dir, exist_ok=True)

    # 匹配格式：-价格-日期（如 -20.41-2025年06月09日）
    pattern = r"(.+?)-(\d+\.\d+)-(\d{4}年\d{2}月\d{2}日)(.*)"

    for filename in os.listdir(path):
        # 跳过子目录（只处理文件）
        filepath = os.path.join(path, filename)
        if not os.path.isfile(filepath):
            continue

        # 分离文件名和扩展名
        basename, ext = os.path.splitext(filename)

        # 查找匹配项
        match = re.fullmatch(pattern, basename)
        if match:
            prefix = match.group(
                1
            )  # 原前缀（如 "行程单-义乌市腾飞汽车代驾服务有限公司"）
            price = match.group(2)  # 价格（如 "20.41"）
            date = match.group(3)  # 日期（如 "2025年06月09日"）
            suffix = match.group(4)  # 可能的后缀（通常为空）

            # 构建新文件名：日期-价格-原前缀
            new_filename = f"{date}-{price}-{prefix}{suffix}{ext}"

            # 复制文件到输出目录（不修改原始文件）
            new_filepath = os.path.join(output_dir, new_filename)
            shutil.copy2(filepath, new_filepath)
            # print(f"已生成: {filename} -> outputs/{new_filename}")
        else:
            print(f"跳过（不匹配）: {filename}")


# 使用示例
if __name__ == "__main__":
    path = input("请输入目录路径: ").strip("\"' ")  # 去除可能的引号
    rename_files(path)
    print("处理完成！输出文件保存在 outputs 目录下。")
