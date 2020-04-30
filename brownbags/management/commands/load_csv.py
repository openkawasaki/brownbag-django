#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import time
import environ

#import config.settings.local as settings

import traceback

import logging
logger = logging.getLogger('init')


import pandas as pd
import numpy as np
import math

import copy

#-------------------------------------------
def filesave(filename, data_list):

    try:
        basedir = os.path.dirname(os.path.abspath(__file__))
        outdir = os.path.join(basedir, "csvdata")
        os.makedirs(outdir, exist_ok=True)
        outputname = os.path.join(outdir, filename)
        utils.write_dict_csv(outputname, data_list)

    except Exception as e:
        logger.error('filesave() error = {}'.format(e))
        traceback.print_exc()
        raise Exception(e)

#-------------------------------------------
def main(filename):

    try:
        pass
    except:
        logger.error("error end")

#-------------------------------------------
# TestCase
#-------------------------------------------

from django.core.management import call_command
from django.test import TestCase

# https://django-testing-docs.readthedocs.io/en/latest/basic_unittests.html

class CommandsTestCase(TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_mycommand(self):
        " Test my custom command."

        args = []
        opts = {}
        call_command('init_facility', *args, **opts)

#-------------------------------------------
# Command
#-------------------------------------------

from django.core.management.base import BaseCommand, CommandError

#-------------------------------------------
class Command(BaseCommand):
    """
    コマンド：init_facilities
    """
    #args = '<param_1 param_2 ...>'
    help = 'HELP'

    # コマンドライン引数を指定
    #def add_arguments(self, parser):
    #    parser.add_argument('hoge', nargs='+', type=int)

    def handle(self, *args, **options):
        try:
            hoges = options['hoge']
            for hoge in hoges:
                main(hoge)

        except:
            logger.error("error end")

"""
#-------------------------------------------
if __name__ == "__main__":
    argv = sys.argv   # コマンドライン引数を格納したリストの取得
    argc = len(argv)  # 引数の個数
"""