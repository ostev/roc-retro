## update and install some things we should probably have
apt-get update
apt-get install -y \
  curl \
  wget \
  git \
  gnupg2 \
  jq \
  sudo \
  zsh \
  vim \
  build-essential \
  llvm \
  clang \
  libasound2 \
  libtinfo6 \
  openssl

# ## Install rustup and common components
curl https://sh.rustup.rs -sSf | sh -s -- -y 
rustup install nightly
rustup component add rustfmt
rustup component add rustfmt --toolchain nightly
rustup component add clippy 
rustup component add clippy --toolchain nightly

cargo install cargo-expand
cargo install cargo-edit

# Install Zig
wget https://ziglang.org/download/0.9.1/zig-linux-x86_64-0.9.1.tar.xz
tar -xf zig-linux-x86_64-0.9.1.tar.xz
sudo ln -s  $(pwd)/zig-linux-x86_64-0.9.1/zig /usr/local/bin/zig

# Install Roc
# wget https://github.com/roc-lang/roc/releases/download/nightly/roc_nightly-linux_x86_64-2022-12-23-4022b44.tar.gz
# tar -xf roc_nightly-linux_x86_64-2022-12-23-4022b44.tar.gz --one-top-level
# sudo mv $(pwd)/roc_nightly-linux_x86_64-2022-12-23-4022b44/roc /usr/local/bin/roc

# Install Node
curl https://get.volta.sh | bash

## setup and install oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
cp -R /root/.oh-my-zsh /home/$USERNAME
cp /root/.zshrc /home/$USERNAME
sed -i -e "s/\/root\/.oh-my-zsh/\/home\/$USERNAME\/.oh-my-zsh/g" /home/$USERNAME/.zshrc
chown -R $USER_UID:$USER_GID /home/$USERNAME/.oh-my-zsh /home/$USERNAME/.zshrc
