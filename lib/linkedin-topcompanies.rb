require "json"

require "linkedin-topcompanies/version"

module Linkedin
  module Topcompanies
    class LinkedInScraper
      attr_reader :keywords, :postalcode, :industry
      attr_reader :linkedin_user, :linkedin_password

      def initialize(args)
        @keywords   = args.fetch(:keywords)
        @postalcode = args.fetch(:postalcode)
        @industry   = args.fetch(:industry)

        @linkedin_user     = args.fetch(:linkedin_user, ENV['LINKEDIN_USER'])
        @linkedin_password = args.fetch(:linkedin_password, ENV['LINKEDIN_PASSWORD'])
      end

      def run
        path        = File.expand_path("../js", File.dirname(__FILE__))
        script      = File.join(path, "linkedin.js")
        credentials = "LINKEDIN_USER='#{linkedin_user}' LINKEDIN_PASSWORD='#{linkedin_password}'"

        command     = %Q(#{credentials} casperjs #{script} "#{keywords}" "#{postalcode}" "#{industry}" "#{path}")
        result      = `#{command}`

        if $?.exitstatus == 0
          JSON.parse(result)
        else
          raise "CasperJS exittend with nonsuccess: #{result}"
        end
      end
    end
  end
end
