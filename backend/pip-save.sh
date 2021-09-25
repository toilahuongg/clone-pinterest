#!/bin/bash
ARG=$1
function pip-save {
    if [[ -z $ARG ]];  
    then
        echo './pip-save.sh <name-package>';
    else
        pip install $ARG && pip freeze | grep $ARG >> requirements.txt
    fi
}
pip-save