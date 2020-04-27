#!/bin/bash
nodeVer="v8.7.0"

T_END="$(tput sgr0)"
T_RED="$(tput setaf 1)"

cd ${0%/*} > /dev/null 2>&1
cd ../  > /dev/null 2>&1

rootPath=${PWD}
installerPath=${rootPath}/installers
installerDataPath=${installerPath}/data
nodeName="node-${nodeVer}-linux-x64"
nodePath=${rootPath}/node_core

if [ "$(whoami)" != "root" ]; then
    echo "Please run as sudo"
    return
fi

node -v > /dev/null 2>&1
if [ $? -eq 0 ]; then
    existsVer=$(node -v)

    msg="Exists NodeJS : $existsVer"

    if [ $nodeVer != $existsVer ]; then
        msg="$msg (${T_RED}Recommended ${nodeVer}${T_END})"
    fi

    echo $msg
    echo "이미 NodeJS가 설치되어 있습니다."
    exit
fi

rm -rf ${nodePath}
mkdir -p ${nodePath}
cp -Rf ${installerDataPath}/${nodeName}.tar.xz ${nodePath}

xz -d ${nodePath}/${nodeName}.tar.xz
tar xvf ${nodePath}/${nodeName}.tar -C ${nodePath}
rm -rf ${nodePath}/${nodeName}.tar
mv ${nodePath}/${nodeName}/* ${nodePath}
rm -rf ${nodePath}/${nodeName}

chown -R ${SUDO_UID}:${SUDO_GID} ${nodePath}
#chown -R ${USERNAME}:${USERNAME} ${nodePath}

cmd1="export PATH=\${PATH}:${nodePath}/bin"
cmd2="alias sudo='sudo env PATH=\${PATH}'"

echo ${cmd1} >> /etc/profile
echo ${cmd2} >> /etc/profile

${cmd1}
su - ${SUDO_USER} -c "npm install -g pm2"

echo "${T_RED}plz reboot${T_END}"